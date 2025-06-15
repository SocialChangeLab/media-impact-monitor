import pandas as pd

from media_impact_monitor.events import get_events
from media_impact_monitor.impact_estimators.time_series_regression import (
    estimate_impact as time_series_regression,
)
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    DatedMeanWithUncertainty,
    EventSearch,
    Impact,
    ImpactEstimate,
    ImpactSearch,
    MeanWithUncertainty,
    Method,
    TrendSearch,
)
from media_impact_monitor.util.cache import cache


@cache
def get_impact(q: ImpactSearch) -> Impact:
    events = get_events(
        EventSearch(
            source="acled",
            topic="climate_change",
            start_date=q.start_date,
            end_date=q.end_date,
        )
    )
    events_from_org = events[events["organizers"].apply(lambda x: q.organizer in x)]
    n_event_days = events_from_org["date"].nunique()
    if n_event_days < 5:
        return Impact(
            method_applicability=False,
            method_limitations=["Not enough events to estimate impact."],
            impact_estimates=None,
        )
    q.impacted_trend.start_date = q.start_date
    q.impacted_trend.end_date = q.end_date
    trends, limitations = get_trend(TrendSearch(**dict(q.impacted_trend)))
    if trends is None:
        return Impact(
            method_applicability=False,
            method_limitations=[
                "There is a problem with the trend data that the impact should be estimated on:",
                *limitations,
            ],
            impact_estimates=None,
        )
    match q.method:
        case "interrupted_time_series":
            raise NotImplementedError("Interrupted time series is not up to date.")
        case "synthetic_control":
            raise NotImplementedError("Synthetic control is not yet implemented.")
        case "time_series_regression":
            mean_impacts, limitations = time_series_regression(
                events=events, article_counts=trends
            )
        case _:
            raise ValueError(f"Unsupported method: {q.method}")
    org = q.organizer
    n_days = 7 - 1
    return Impact(
        method_applicability=True,
        method_limitations=[],
        impact_estimates={
            topic_name: ImpactEstimate(
                absolute_impact=MeanWithUncertainty(
                    mean=topic_impact[org]["mean"],
                    ci_upper=topic_impact[org]["ci_upper"],
                    ci_lower=topic_impact[org]["ci_lower"],
                    p_value=topic_impact[org]["p_value"],
                ),
                absolute_impact_time_series=[],
            )
            for topic_name, topic_impact in mean_impacts.items()
        },
    )
