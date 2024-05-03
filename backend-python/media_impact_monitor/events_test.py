from datetime import date

from pytest import raises

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


def test_filter_basic():
    # check that filtering by organization works
    df1 = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
            organizers=["Last Generation (Germany)"],
        )
    )
    assert len(df1) > 100
    assert (
        df1["organizers"].explode().value_counts().index[0]
        == "Last Generation (Germany)"
    )
    df2 = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
        )
    )
    df2 = df2[df2["organizers"].apply(lambda x: "Last Generation (Germany)" in x)]
    df2 = df2.reset_index(drop=True)
    assert len(df2) > 100
    assert (
        df2["organizers"].explode().value_counts().index[0]
        == "Last Generation (Germany)"
    )
    assert df1.shape == df2.shape
    assert str(df1) == str(df2)


def test_filter_case_insensitive():
    # check that it also works for incorrect case
    df1 = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
            organizers=["Fridays For Future"],  # wrong case, should work anyway!
        )
    )
    assert len(df1) > 100
    assert df1["organizers"].explode().value_counts().index[0] == "Fridays for Future"
    df2 = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
        )
    )
    df2 = df2[df2["organizers"].apply(lambda x: "Fridays for Future" in x)]
    df2 = df2.reset_index(drop=True)
    assert len(df2) > 100
    assert df2["organizers"].explode().value_counts().index[0] == "Fridays for Future"
    assert df1.shape == df2.shape
    assert str(df1) == str(df2)


def test_filter_aliases():
    # check that it also works for aliases
    df1 = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
            organizers=["Letzte Generation"],
        )
    )
    assert len(df1) > 100
    assert (
        df1["organizers"].explode().value_counts().index[0]
        == "Last Generation (Germany)"
    )
    df2 = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 1, 1),
            end_date=date(2023, 12, 31),
            organizers=["Last Generation (Germany)"],
        )
    )
    assert len(df2) > 100
    assert (
        df2["organizers"].explode().value_counts().index[0]
        == "Last Generation (Germany)"
    )
    assert df1.shape == df2.shape
    assert str(df1) == str(df2)


def test_filter_non_existing():
    # check that it doesn't work for non-existing organizations
    with raises(ValueError):
        get_events(
            EventSearch(
                event_type="protest",
                source="acled",
                start_date=date(2023, 1, 1),
                end_date=date(2023, 12, 31),
                organizers=["First Generation (Germany)"],
            )
        )
