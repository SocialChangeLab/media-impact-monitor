from datetime import date

import pandas as pd
import swifter
from joblib import hash as joblib_hash

from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.data_loaders.protest.climate_groups import acled_keys
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    estimate_impact,
)
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import Event, EventSearch, TrendSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.date import verify_dates


@cache
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
                | df["organizers"].isin(acled_keys)
            ]
        case _:
            raise ValueError(f"Unsupported topic: {q.topic}")
    if q.query:
        assert not any(
            sym in q.query.lower() for sym in ["or", "and", ",", "'", '"']
        ), "Query must be a single keyword."
        df = df[df["description"].str.lower().str.contains(q.query.lower())]
    if q.organizers:
        # TODO: verify that they are all spelled correctly
        df = df[df["organizers"].apply(lambda x: any(org in x for org in q.organizers))]
    df["date"] = df["date"].dt.date
    df["event_id"] = df.apply(joblib_hash, axis=1, raw=True)
    df["impact"] = None
    if q.estimate_impact:
        df["impact"] = df.swifter.apply(get_impact, axis=1)
    return df.reset_index(drop=True)


@cache
def get_impact(event):
    trend = get_trend(
        TrendSearch(
            trend_type="keywords",
            media_source="news_online",
            start_date=event["date"] - pd.Timedelta(days=28),
            end_date=event["date"] + pd.Timedelta(days=28),
            query="|".join(event["organizers"]),
        )
    )
    horizon = 11
    hidden_days_before_protest = 4
    actuals, counterfactuals, impacts = estimate_impact(
        event_date=event["date"],
        df=trend,
        horizon=horizon,
        hidden_days_before_protest=hidden_days_before_protest,
    )
    impact = impacts.loc[event["date"] : event["date"] + pd.Timedelta(days=7)].sum()
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
