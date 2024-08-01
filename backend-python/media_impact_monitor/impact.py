from datetime import date

import pandas as pd

from media_impact_monitor.events import get_events
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    estimate_mean_impact as interrupted_time_series,
)
from media_impact_monitor.impact_estimators.time_series_regression import (
    estimate_impact as time_series_regression,
)
from media_impact_monitor.impact_estimators.correlation import (
    estimate_impact as correlation,
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
            organizers=[q.organizer],
            start_date=q.start_date,
            end_date=q.end_date,
        )
    )
    n_event_days = events["date"].nunique()
    if n_event_days < 5:
        return Impact(
            method_applicability=False,
            method_limitations=["Not enough events to estimate impact."],
            impact_estimates=None,
        )
    q.impacted_trend.start_date = q.start_date
    q.impacted_trend.end_date = q.end_date
    trends_or_limitation = get_trend(
        TrendSearch(**dict(q.impacted_trend)), as_json=False
    )
    if isinstance(trends_or_limitation, str):
        return Impact(
            method_applicability=False,
            method_limitations=[
                "There is a problem with the trend data that the impact should be estimated on.",
                trends_or_limitation,
            ],
            impact_estimates=None,
        )
    trends = trends_or_limitation
    applicabilities = []
    lims_list = []
    dfs = dict()
    for topic in trends.columns:
        trend = trends[topic]
        if trend.empty:
            applicabilities.append(False)
            lims_list.append([f"No media data available for {q.impacted_trend}."])
            continue
        trend.name = "count"
        appl, limitations, impact = get_impact_for_single_trend(
            events=events,
            trend=trend,
            method=q.method,
            aggregation=q.impacted_trend.aggregation,
        )
        dfs[topic] = impact
        applicabilities.append(appl)
        lims_list.append(limitations)
    assert len(set(applicabilities)) == 1, "All topics should have same applicability."
    assert (
        len(set([str(lims) for lims in lims_list])) == 1
    ), "All topics should have same limitations."
    n_days = 7 - 1
    return Impact(
        method_applicability=applicabilities[0],
        method_limitations=lims_list[0],
        impact_estimates={
            topic: ImpactEstimate(
                absolute_impact=MeanWithUncertainty(
                    mean=impact["mean"].loc[n_days],
                    ci_upper=impact["ci_upper"].loc[n_days],
                    ci_lower=impact["ci_lower"].loc[n_days],
                ),
                absolute_impact_time_series=[
                    DatedMeanWithUncertainty(**d)
                    for d in dfs[topic].reset_index().to_dict(orient="records")
                ],
                # relative_impact=MeanWithUncertainty(  # TODO: calculate relative impact
                #     mean=1.0,
                #     ci_upper=1.0,
                #     ci_lower=1.0,
                # ),
                # relative_impact_time_series=[],
            )
            for topic, impact in dfs.items()
        }
        if applicabilities[0]
        else None,
    )


def get_impact_for_single_trend(
    events: pd.DataFrame,
    trend: pd.DataFrame,
    method: Method,
    aggregation="daily",
) -> tuple[bool, list[str], pd.DataFrame]:
    hidden_days_before_protest = 7
    horizon = 28
    match method:
        case "interrupted_time_series":
            mean_impact, limitations = interrupted_time_series(
                events=events,
                article_counts=trend,
                horizon=horizon,
                hidden_days_before_protest=hidden_days_before_protest,
                aggregation=aggregation,
            )
        case "synthetic_control":
            raise NotImplementedError("Synthetic control is not yet implemented.")
        case "time_series_regression":
            mean_impact, limitations = time_series_regression(
                events=events,
                article_counts=trend,
                aggregation=aggregation,
            )
        case _:
            raise ValueError(f"Unsupported method: {method}")
    return True, limitations, mean_impact
    # TODO: divide impact by number of events on that day (by the same org)
