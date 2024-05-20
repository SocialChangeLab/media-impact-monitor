import math
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


@cache
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
    org_freqs = df["organizers"].str[0].value_counts()

    def sort_organizers(organizers: list[str]) -> list[str]:
        return sorted(organizers, key=lambda x: org_freqs.get(x, 0), reverse=True)

    df["organizers"] = df["organizers"].apply(sort_organizers)
    df = df[
        df["organizers"].str[0].isin(org_freqs.index[:8])
    ]  # TODO: remove this, or do it in the frontend
    df["organizer_aliases"] = df["organizers"].apply(add_aliases)

    def get_chart_position(row: pd.Series) -> int:
        protests_on_same_day = df[df["date"] == row["date"]].sort_values(
            by=["size_number", "description"], ascending=False
        )
        current_row_index = protests_on_same_day.index.get_loc(row.name)
        position = (
            protests_on_same_day.iloc[:current_row_index]["size_number"]
            .apply(scale)
            .sum()
        )
        position += scale(row["size_number"]) / 2
        return position

    df["chart_position"] = df.apply(get_chart_position, axis=1)
    return df.reset_index(drop=True)


def scale(x):
    return math.sqrt(max(10_000, x))


def add_aliases(orgs: list[str]) -> list[str]:
    return orgs + list(chain(*[climate_orgs_aliases.get(org, []) for org in orgs]))


def get_events_by_id(event_ids: list[str]) -> pd.DataFrame:
    df = get_events(EventSearch(source="acled"))
    df = df[df["event_id"].isin(event_ids)]
    return df.reset_index(drop=True)
