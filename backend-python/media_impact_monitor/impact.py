import pandas as pd

from media_impact_monitor.events import get_events_by_id
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    estimate_impacts,
    estimate_mean_impact,
)
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import Impact, ImpactSearch, Method, TrendSearch
from media_impact_monitor.util.cache import cache


# @cache
def get_impact(q: ImpactSearch) -> Impact:
    events = get_events_by_id(q.cause)
    trends = get_trend(TrendSearch(**dict(q.effect)))
    trend = trends["policy"]
    trend.name = "count"
    impact = get_impact_for_single_trend(events, trend, q.method)
    return impact


def get_impact_for_single_trend(
    events: pd.DataFrame, trend: pd.DataFrame, method: Method
) -> Impact:
    hidden_days_before_protest = 7
    horizon = 28
    aggregation = "weekly"
    match method:
        case "interrupted_time_series":
            mean_impact = estimate_mean_impact(
                events=events,
                article_counts=trend,
                horizon=horizon,
                hidden_days_before_protest=hidden_days_before_protest,
                aggregation=aggregation,
            )
        case "synthetic_control":
            raise NotImplementedError("Synthetic control is not yet implemented.")
        case _:
            raise ValueError(f"Unsupported method: {method}")
    return Impact(
        method_applicability="maybe",
        method_applicability_reason="We're not checking this yet 🤡",
        time_series=mean_impact.to_dict(orient="index"),
    )
    # TODO: divide impact by number of events on that day (by the same org)
