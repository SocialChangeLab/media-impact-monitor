import re
from datetime import date
from itertools import chain

import pandas as pd
from joblib import hash as joblib_hash

from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.data_loaders.protest.climate_orgs import (
    climate_orgs,
    climate_orgs_aliases,
)
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    estimate_impact,
)
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import EventSearch, TrendSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.date import verify_dates
from media_impact_monitor.util.parallel import parallel_tqdm


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
        _all_organizers = [org.lower() for org in all_organizers()]
        for org in q.organizers:
            assert org.lower() in _all_organizers, f"Unknown organizer: {org}"
        _organizers = [org.lower() for org in q.organizers]
        df = df[
            df["organizers"].apply(
                lambda x: any(org.lower() in _organizers for org in x)
            )
        ]
    df["date"] = df["date"].dt.date
    df["event_id"] = df.apply(joblib_hash, axis=1, raw=True)
    df["impact"] = None
    if q.estimate_impact:
        events = df.to_dict(orient="records")
        impacts = parallel_tqdm(
            get_impact, events, total=len(events), n_jobs=4, desc="Estimating impacts"
        )
        df["impact"] = impacts
    return df.reset_index(drop=True)


@cache
def get_impact(event):
    orgs = event["organizers"]
    orgs = orgs + list(chain(*[climate_orgs_aliases.get(org, []) for org in orgs]))
    orgs = [re.sub(r"\s*\(.*\)", "", org) for org in orgs]
    orgs_query = " OR ".join([f'"{org}"' for org in orgs])
    trend = get_trend(
        TrendSearch(
            trend_type="keywords",
            media_source="news_online",
            start_date=event["date"] - pd.Timedelta(days=180),
            end_date=event["date"] + pd.Timedelta(days=28),
            query=orgs_query,
        )
    )
    hidden_days_before_protest = 4
    horizon = hidden_days_before_protest + 28
    actuals, counterfactuals, impacts = estimate_impact(
        event_date=event["date"],
        df=trend,
        horizon=horizon,
        hidden_days_before_protest=hidden_days_before_protest,
    )
    impact = impacts.cumsum().loc[event["date"] + pd.Timedelta(days=14)]
    # TODO: divide impact by number of events on that day (by the same org)
    return impact


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
            end_date=date(2023, 12, 31),
        )
    )


@cache
def all_organizers():
    df = all_events()
    return df["organizers"].explode().value_counts().index.tolist()
