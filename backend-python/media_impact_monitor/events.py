from datetime import date
from itertools import chain

import pandas as pd
from joblib import hash as joblib_hash

from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.data_loaders.protest.climate_orgs import (
    climate_orgs,
    climate_orgs_aliases,
)
from media_impact_monitor.types_ import EventSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.date import verify_dates


# @cache
def get_events(q: EventSearch) -> pd.DataFrame:
    assert q.event_type == "protest", "Only protests are supported."
    assert q.source == "acled", "Only ACLED is supported."
    assert verify_dates(q.start_date, q.end_date)
    df = get_acled_events(
        countries=["Germany"], start_date=q.start_date, end_date=q.end_date
    )
    if df.empty:
        return q, []
    match q.topic:
        case None:
            pass
        case "climate_change":
            df = df[
                df["description"].str.lower().str.contains("climate")
                | df["organizers"].isin(climate_orgs)
            ]
        case _:
            raise ValueError(f"Unsupported topic: {q.topic}")
    if q.query:
        assert not any(
            sym in q.query.lower() for sym in ["or", "and", ",", "'", '"']
        ), "Query must be a single keyword."
        df = df[df["description"].str.lower().str.contains(q.query.lower())]
    if q.organizers:
        df = filter_by_organizers(df, q.organizers)
    df["event_id"] = df.apply(joblib_hash, axis=1, raw=True)
    return df.reset_index(drop=True)


def filter_by_organizers(df: pd.DataFrame, organizers: list[str]) -> pd.DataFrame:
    # check for correct spelling
    for org in organizers:
        if not overlap_case_insensitive([org], add_aliases(climate_orgs)):
            raise ValueError(f"Unknown organizer: {org}")
    # filter
    df = df[
        df["organizers"]
        .apply(add_aliases)
        .apply(lambda x: overlap_case_insensitive(x, organizers))
    ]
    return df


def add_aliases(orgs: list[str]) -> list[str]:
    return orgs + list(chain(*[climate_orgs_aliases.get(org, []) for org in orgs]))


def overlap_case_insensitive(s1: list[str], s2: list[str]) -> bool:
    # do the sets overlap (ignoring case)?
    _s1 = set(s.lower() for s in s1)
    _s2 = set(s.lower() for s in s2)
    return bool(_s1 & _s2)


def get_events_by_id(event_ids: list[str]) -> pd.DataFrame:
    df = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2020, 1, 1),
            end_date=date.today(),
        )
    )
    df = df[df["event_id"].isin(event_ids)]
    return df.reset_index(drop=True)


@cache
def all_events():
    return get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2020, 1, 1),
            end_date=date(2024, 3, 31),
        )
    )


@cache
def all_organizers():
    df = all_events()
    return df["organizers"].explode().value_counts().index.tolist()
