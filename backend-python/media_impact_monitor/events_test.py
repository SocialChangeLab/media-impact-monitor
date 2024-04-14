from media_impact_monitor.events import get_events, get_events_by_id
from media_impact_monitor.types_ import EventSearch


def test_retrieval_by_id():
    """Test that events can be retrieved by their IDs."""
    events = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            topic="climate_change",
            start_date="2023-01-01",
            end_date="2023-12-31",
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
