"""Synthetic loader checks; no licensed dataset in fixtures."""

from datetime import date
from unittest.mock import Mock

import pytest
import requests

from media_impact_monitor.data_loaders.protest.acled import acled
from media_impact_monitor.data_loaders.protest.acled.acled_size import get_size_number


@pytest.fixture(autouse=True)
def synthetic_authorization(monkeypatch):
    monkeypatch.setattr(
        acled,
        "authorization_headers",
        Mock(
            return_value={
                "Authorization": "Bearer synthetic-token",
                "Content-Type": "application/json",
            }
        ),
    )


def test_loader_reenabled_with_minimal_private_fields(monkeypatch):
    response = Mock()
    response.json.return_value = {
        "data": [
            {
                "event_date": "2024-01-01",
                "assoc_actor_1": "FFF: Fridays for Future (Germany)",
                "notes": "Synthetic climate protest",
                "tags": "",
            }
        ]
    }
    fetch = Mock(return_value=response)
    monkeypatch.setattr(acled, "get", fetch)
    frame = acled.get_acled_events.func(
        end_date=date(2024, 1, 2), countries=["Germany"]
    )
    assert len(frame) == 1
    assert frame.iloc[0]["organizers"] == ["Fridays for Future"]
    assert frame.iloc[0]["size_number"] is None
    assert not {"country", "region", "city", "event_type"} & set(frame.columns)
    assert (
        fetch.call_args.kwargs["params"]["fields"]
        == "event_date|assoc_actor_1|notes|tags"
    )
    response.raise_for_status.assert_called_once()


def test_provider_auth_failure_is_not_silenced(monkeypatch):
    response = Mock()
    response.raise_for_status.side_effect = requests.HTTPError("401 Unauthorized")
    monkeypatch.setattr(acled, "get", Mock(return_value=response))
    with pytest.raises(requests.HTTPError):
        acled.get_acled_events.func(end_date=date(2024, 1, 2), countries=["Germany"])
    response.json.assert_not_called()


@pytest.mark.parametrize(
    "value, expected", [(None, None), ("no report", None), ("0", 0), ("100", 100)]
)
def test_size_unknown_is_not_zero(value, expected):
    assert get_size_number(value) == expected


def test_invalid_region_combination_does_not_authenticate(monkeypatch):
    authenticate = Mock(side_effect=AssertionError("Must not authenticate"))
    monkeypatch.setattr(acled, "authorization_headers", authenticate)
    with pytest.raises(AssertionError, match="Specify countries or regions"):
        acled.get_acled_events.func(
            end_date=date(2024, 1, 2), countries=["Germany"], regions=["Europe"]
        )
    authenticate.assert_not_called()
