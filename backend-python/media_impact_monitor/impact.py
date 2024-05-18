import pandas as pd

from media_impact_monitor.events import get_events_by_id
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    estimate_mean_impact,
)
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import Impact, ImpactSearch, Method, TrendSearch
from media_impact_monitor.util.cache import cache


# @cache
def get_impact(q: ImpactSearch) -> Impact:
    events = get_events_by_id(q.cause)
    trends = get_trend(TrendSearch(**dict(q.effect)))
    applicabilities = []
    limitations = []
    dfs = dict()
    for topic in trends.columns:
        trend = trends[topic]
        trend.name = "count"
        appl, warning, impact = get_impact_for_single_trend(
            events=events,
            trend=trend,
            method=q.method,
            aggregation=q.effect.aggregation,
        )
        dfs[topic] = impact.reset_index().to_dict(orient="records")
        applicabilities.append(appl)
        limitations.append(warning)
    assert len(set(applicabilities)) == 1, "All topics should have same applicability."
    assert len(set(limitations)) == 1, "All topics should have same limitations."
    impact = dict(
        method_applicability=applicabilities[0],
        method_applicability_reason=limitations[0],
        time_series=dfs,
    )
    return impact


def get_impact_for_single_trend(
    events: pd.DataFrame,
    trend: pd.DataFrame,
    method: Method,
    aggregation="daily",
) -> tuple[str, str, pd.DataFrame]:
    hidden_days_before_protest = 7
    horizon = 28
    match method:
        case "interrupted_time_series":
            mean_impact, warnings = estimate_mean_impact(
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
    warning = "We are not yet systematically checking the applicability of the impact estimation method.\n\n"
    if warnings:
        warning += "However, we have determined the following limitations:\n\n"
        warning += "\n".join([f"- {w}" for w in warnings])
    return "maybe", warning, mean_impact
    # TODO: divide impact by number of events on that day (by the same org)
