"""Publication boundary tests use synthetic data, including legacy cache columns."""

from datetime import date
from unittest.mock import Mock

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from media_impact_monitor import api
from media_impact_monitor.public_events import publish_events
from media_impact_monitor.types_ import EventSearch

FIELDS = {
    "summary_id",
    "source",
    "date",
    "organizers",
    "size_number",
    "event_count",
    "unknown_size_count",
}


def raw_events():
    return pd.DataFrame(
        [
            {
                "date": date(2024, 1, 1),
                "organizers": orgs,
                "size_number": size,
                "description": "PRIVATE NOTES",
                "city": "PRIVATE CITY",
                "country": "Germany",
                "region": "PRIVATE REGION",
                "event_type": "PRIVATE TYPE",
                "size_text": "PRIVATE TAGS",
                "source": "acled",
                "event_id": f"PRIVATE ID {i}",
                "extra": "PRIVATE EXTRA",
            }
            for i, (orgs, size) in enumerate(
                [(["B", "A"], 100), (["A", "B"], None), (["A"], 200), ([], None)]
            )
        ]
    )


def test_daily_groups_conserve_all_events_and_known_sizes():
    rows = publish_events(EventSearch(source="acled"), raw_events())
    assert len(rows) == 3
    assert all(set(row) == FIELDS for row in rows)
    assert sum(row["event_count"] for row in rows) == 4
    assert sum(row["unknown_size_count"] for row in rows) == 2
    assert sum(row["size_number"] or 0 for row in rows) == 300
    combined = next(row for row in rows if row["organizers"] == ["A", "B"])
    assert combined["event_count"] == 2
    assert combined["size_number"] == 100
    assert combined["unknown_size_count"] == 1
    assert next(row for row in rows if not row["organizers"])["size_number"] is None
    assert "PRIVATE" not in str(rows)


def test_restricted_fields_cannot_influence_summary_or_identifier():
    frame = raw_events()
    expected = publish_events(EventSearch(source="acled"), frame)
    for column in set(frame.columns) - {"date", "organizers", "size_number", "source"}:
        frame[column] = "DIFFERENT SECRET"
    actual = publish_events(EventSearch(source="acled"), frame.iloc[::-1])
    assert actual == expected
    assert len({row["summary_id"] for row in actual}) == 3


@pytest.mark.parametrize("frame", [None, pd.DataFrame()])
def test_empty_events(frame):
    assert publish_events(EventSearch(source="acled"), frame) == []


@pytest.mark.parametrize("path", ["/events", "/events?view=summary-v1"])
def test_api_sanitizes_legacy_cached_rows(monkeypatch, path):
    monkeypatch.setattr(api, "get_events", Mock(return_value=raw_events()))
    response = TestClient(api.app).post(path, json={"source": "acled"})
    assert response.status_code == 200
    rows = response.json()["data"]
    assert all(set(row) == FIELDS for row in rows)
    assert sum(row["event_count"] for row in rows) == 4
    assert "PRIVATE" not in response.text


def test_press_release_contract_unchanged():
    frame = raw_events().iloc[:1].copy()
    frame["source"] = "press_releases"
    row = publish_events(EventSearch(source="press_releases"), frame)[0]
    assert row["description"] == "PRIVATE NOTES"
    assert "extra" not in row


def test_source_mismatch_cannot_bypass_acled_boundary(monkeypatch):
    monkeypatch.setattr(api, "get_events", Mock(return_value=raw_events()))
    response = TestClient(api.app, raise_server_exceptions=False).post(
        "/events", json={"source": "press_releases"}
    )
    assert response.status_code == 500
    assert "PRIVATE" not in response.text


def test_event_fulltexts_disabled_before_cached_lookup(monkeypatch):
    fetch = Mock(side_effect=AssertionError("Cached event lookup must not run"))
    monkeypatch.setattr(api, "get_fulltexts", fetch)
    response = TestClient(api.app).post(
        "/fulltexts", json={"media_source": "news_online", "event_id": "old-event-id"}
    )
    assert response.status_code == 422
    fetch.assert_not_called()


def test_errors_do_not_publish_provider_payloads(monkeypatch):
    monkeypatch.setattr(
        api, "get_events", Mock(side_effect=RuntimeError("PRIVATE NOTES"))
    )
    response = TestClient(api.app, raise_server_exceptions=False).post(
        "/events", json={"source": "acled"}
    )
    assert response.status_code == 500
    assert "PRIVATE" not in response.text


def test_press_release_api_contract(monkeypatch):
    frame = raw_events().iloc[:1].copy()
    frame["source"] = "press_releases"
    monkeypatch.setattr(api, "get_events", Mock(return_value=frame))
    response = TestClient(api.app).post("/events", json={"source": "press_releases"})
    assert response.status_code == 200
    row = response.json()["data"][0]
    assert row["date"] == "2024-01-01"
    assert row["description"] == "PRIVATE NOTES"
    assert "extra" not in row


def test_negative_sizes_fail_closed_even_when_group_total_is_positive():
    frame = raw_events().iloc[:2].copy()
    frame["size_number"] = [100, -10]
    with pytest.raises(ValueError):
        publish_events(EventSearch(source="acled"), frame)


@pytest.mark.parametrize("source", ["press_releases", None])
def test_wrong_source_rejected_for_acled(source):
    frame = raw_events()
    frame.loc[0, "source"] = source
    with pytest.raises(ValueError):
        publish_events(EventSearch(source="acled"), frame)


def test_missing_dates_cannot_drop_events():
    frame = raw_events()
    frame.loc[0, "date"] = pd.NaT
    with pytest.raises(ValueError):
        publish_events(EventSearch(source="acled"), frame)


def test_numeric_strings_sum_numerically():
    frame = raw_events().iloc[:2].copy()
    frame["size_number"] = ["100", "200"]
    rows = publish_events(EventSearch(source="acled"), frame)
    assert rows[0]["size_number"] == 300
    assert rows[0]["event_count"] == 2
