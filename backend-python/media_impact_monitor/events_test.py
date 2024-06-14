from datetime import date

import pytest
from pytest import raises

from media_impact_monitor.events import get_events, get_events_by_id
from media_impact_monitor.types_ import EventSearch


def test_events_basic():
    df = get_events(EventSearch(source="acled", end_date=date(2024, 1, 1)))
    df = df[df["organizers"].apply(lambda x: "Last Generation (Germany)" in x)]
    assert len(df) > 100


def test_events_topic():
    df1 = get_events(EventSearch(source="acled", end_date=date(2024, 1, 1)))
    df2 = get_events(
        EventSearch(source="acled", topic="climate_change", end_date=date(2024, 1, 1))
    )
    assert len(df1) > len(df2)
    datestexts = set(df1[["date", "description"]].astype(str).itertuples(index=False))
    datestexts = set(df2[["date", "description"]].astype(str).itertuples(index=False))
    assert datestexts.issuperset(datestexts)
    ids1 = set(df1["event_id"])
    ids2 = set(df2["event_id"])
    assert ids1.issuperset(ids2)


@pytest.mark.skip()
def test_retrieval_by_id():
    """Test that events can be retrieved by their IDs."""
    events = get_events(
        EventSearch(
            source="acled",
            topic="climate_change",
            end_date=date(2024, 5, 25),
        )
    )
    event_ids = events["event_id"].tolist()
    assert len(event_ids) > 0
    retrieved = get_events_by_id(event_ids)
    assert not retrieved.empty
    assert len(retrieved) == len(event_ids)
    assert all(retrieved["event_id"].isin(events["event_id"]))
    assert all(events["event_id"].isin(retrieved["event_id"]))
    assert str(retrieved) == str(events)
