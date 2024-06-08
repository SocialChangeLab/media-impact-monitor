from datetime import date

import pytest
from pytest import raises

from media_impact_monitor.events import get_events, get_events_by_id
from media_impact_monitor.types_ import EventSearch


@pytest.mark.skip(reason="TODO!")  # TODO FIXME!
def test_retrieval_by_id():
    """Test that events can be retrieved by their IDs."""
    events = get_events(
        EventSearch(
            source="acled",
            topic="climate_change",
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


def test_events_basic():
    df2 = get_events(EventSearch(source="acled", end_date=date(2024, 1, 1)))
    df2 = df2[df2["organizers"].apply(lambda x: "Last Generation (Germany)" in x)]
    assert len(df2) > 100
