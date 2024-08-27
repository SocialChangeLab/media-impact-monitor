from datetime import date, timedelta

import pandas as pd

from media_impact_monitor.events import (
    filter_climate_orgs,
    get_events,
    get_events_by_id,
    org_freqs,
    organizers_with_id,
)
from media_impact_monitor.types_ import EventSearch, Organizer


def test_get_events_basic():
    end_date = date(2024, 1, 1)
    df = get_events(EventSearch(source="acled", end_date=end_date))
    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    assert set(df.columns) == {
        "date",
        "event_type",
        "country",
        "region",
        "city",
        "organizers",
        "size_text",
        "size_number",
        "description",
        "source",
        "event_id",
        "organizer_aliases",
    }
    assert all(df["country"] == "Germany")
    assert all(df["source"] == "acled")

    # Check for Last Generation events
    df_last_gen = df[df["organizers"].apply(lambda x: "Last Generation" in x)]
    assert len(df_last_gen) > 100


def test_get_events_with_filters():
    end_date = date.today()
    start_date = end_date - timedelta(days=90)

    # Test with date range and topic
    q_climate = EventSearch(
        source="acled", end_date=end_date, start_date=start_date, topic="climate_change"
    )
    df_climate = get_events(q_climate)
    assert all(df_climate["date"].between(start_date, end_date))

    # Test with specific organizer
    q_fff = EventSearch(
        source="acled",
        end_date=end_date,
        start_date=start_date,
        organizers=["Fridays for Future"],
    )
    df_fff = get_events(q_fff)
    assert all(df_fff["organizers"].apply(lambda x: "Fridays for Future" in x))


def test_get_events_topic_comparison():
    end_date = date(2024, 1, 1)
    df_all = get_events(EventSearch(source="acled", end_date=end_date))
    df_climate = get_events(
        EventSearch(source="acled", topic="climate_change", end_date=end_date)
    )

    assert len(df_all) > len(df_climate)

    ids_all = set(df_all["event_id"])
    ids_climate = set(df_climate["event_id"])
    assert ids_all.issuperset(ids_climate)

    strs_all = set(df_all.astype(str).itertuples(index=False))
    strs_climate = set(df_climate.astype(str).itertuples(index=False))
    assert strs_all.issuperset(strs_climate)


def test_get_events_by_id():
    end_date = date(2024, 4, 1)
    start_date = date(2024, 1, 1)
    events = get_events(
        EventSearch(
            source="acled",
            topic="climate_change",
            start_date=start_date,
            end_date=end_date,
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


def test_filter_climate_orgs():
    df = pd.DataFrame(
        {
            "description": [
                "Climate protest",
                "Political rally",
                "Environmental action",
            ],
            "organizers": [["Fridays for Future"], ["Political Party"], ["Greenpeace"]],
        }
    )

    filtered_df = filter_climate_orgs(df)
    assert len(filtered_df) == 2
    assert all(filtered_df.index == [0, 2])


def test_org_freqs():
    freqs = org_freqs()
    assert isinstance(freqs, pd.Series)
    assert not freqs.empty
    assert freqs.index.is_unique
    assert (freqs >= 0).all()


def test_organizers_with_id():
    organizers = organizers_with_id()
    assert isinstance(organizers, list)
    assert len(organizers) > 0
    assert all(isinstance(org, Organizer) for org in organizers)
    assert all(org.organizer_id and org.name for org in organizers)
