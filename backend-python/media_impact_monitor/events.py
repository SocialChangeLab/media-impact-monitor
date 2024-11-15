from datetime import date

import pandas as pd
from joblib import hash as joblib_hash
from slugify import slugify

from media_impact_monitor.data_loaders.protest.acled.acled import get_acled_events
from media_impact_monitor.data_loaders.protest.climate_orgs import (
    add_aliases,
    climate_orgs,
)
from media_impact_monitor.data_loaders.protest.press_releases.last_generation.categorize import (
    code_press_releases as get_press_release_events,
)
from media_impact_monitor.types_ import EventSearch, Organizer
from media_impact_monitor.util.cache import cache


@cache
def get_events(q: EventSearch) -> pd.DataFrame | None:
    match q.source:
        case "acled":
            df = get_acled_events(end_date=q.end_date, countries=["Finland"])
        case "press_releases":
            df = get_press_release_events(end_date=q.end_date)
    if df.empty:
        return
    match q.topic:
        case None:
            pass
        case "climate_change":
            df = filter_climate_orgs(df)
        case _:
            raise ValueError(f"Unsupported topic: {q.topic}")
    if q.organizers:
        df = df[df["organizers"].apply(lambda x: any(org in q.organizers for org in x))]
    if q.start_date:
        df = df[df["date"] >= q.start_date]
    if q.end_date:
        df = df[df["date"] <= q.end_date]
    df["event_id"] = df.apply(joblib_hash, axis=1, raw=True)
    _org_freqs = org_freqs()

    def sort_organizers(organizers: list[str]) -> list[str]:
        return sorted(organizers, key=lambda x: _org_freqs.get(x, 0), reverse=True)

    df["organizers"] = df["organizers"].apply(sort_organizers)
    df["organizer_aliases"] = df["organizers"].apply(add_aliases)
    return df.reset_index(drop=True)


def filter_climate_orgs(df: pd.DataFrame) -> pd.DataFrame:
    return df[
        df["description"].str.lower().str.contains("climate")
        | df["organizers"].apply(lambda x: any(org in climate_orgs for org in x))
    ]


@cache
def org_freqs():
    # hacky solution to get the frequency of organizers, in a stable way
    df = get_acled_events(end_date=date(2024, 1, 1), countries=["Finland"])
    df = filter_climate_orgs(df)
    return df["organizers"].str[0].value_counts()


def organizers_with_id():
    orgs = org_freqs().index.tolist()
    return [Organizer(organizer_id=slugify(org), name=org) for org in orgs]


def get_events_by_id(event_ids: list[str]) -> pd.DataFrame:
    df = get_events(EventSearch(source="acled", end_date=date.today()))
    df = df[df["event_id"].isin(event_ids)]
    return df.reset_index(drop=True)
