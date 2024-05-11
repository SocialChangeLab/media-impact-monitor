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


def get_events(q: EventSearch) -> pd.DataFrame:
    assert q.source == "acled", "Only ACLED is supported."
    df = get_acled_events(countries=["Germany"])
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
    df["event_id"] = df.apply(joblib_hash, axis=1, raw=True)
    org_freqs = df["organizers"].explode().value_counts()

    def sort_organizers(organizers: list[str]) -> list[str]:
        return sorted(organizers, key=lambda x: org_freqs.get(x, 0), reverse=True)

    df["organizers"] = df["organizers"].apply(sort_organizers)
    df["organizer_aliases"] = df["organizers"].apply(add_aliases)
    return df.reset_index(drop=True)


def add_aliases(orgs: list[str]) -> list[str]:
    return orgs + list(chain(*[climate_orgs_aliases.get(org, []) for org in orgs]))


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
