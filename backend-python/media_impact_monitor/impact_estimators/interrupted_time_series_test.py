from datetime import date, timedelta

import pandas as pd

from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    estimate_impact,
    estimate_impacts,
    estimate_mean_impact,
)


def test_estimate_impact():
    article_counts = get_genios_counts(
        '"Letzte Generation"', start_date=date(2023, 1, 1), end_date=date(2024, 3, 31)
    )
    actual, counterfactual, impact = estimate_impact(
        date(2023, 7, 1),
        article_counts,
        horizon=14,
        hidden_days_before_protest=2,
        aggregation="daily",
    )
    assert isinstance(actual, pd.Series)
    assert isinstance(counterfactual, pd.Series)
    assert isinstance(impact, pd.Series)
    assert actual.index.is_monotonic_increasing
    assert actual.index[0] == date(2023, 7, 1) - timedelta(days=2)
    assert actual.index[-1] == date(2023, 7, 1) + timedelta(days=13)
    assert counterfactual.index.is_monotonic_increasing
    assert counterfactual.index[0] == date(2023, 7, 1) - timedelta(days=2)
    assert counterfactual.index[-1] == date(2023, 7, 1) + timedelta(days=13)
    assert impact.index.is_monotonic_increasing
    assert impact.index[0] == date(2023, 7, 1) - timedelta(days=2)
    assert impact.index[-1] == date(2023, 7, 1) + timedelta(days=13)


def test_estimate_impacts():
    # get events and article counts for "Last Generation" in 2023
    events = get_acled_events(
        countries=["Germany"], start_date=date(2023, 7, 1), end_date=date(2023, 12, 31)
    )
    events = events[events["organizers"].apply(lambda x: "Last Generation" in x)]
    article_counts = get_genios_counts(
        '"Letzte Generation"', start_date=date(2023, 1, 1), end_date=date(2024, 3, 31)
    )
    actuals, counterfactuals, impacts, warnings = estimate_impacts(
        events,
        article_counts,
        horizon=7,
        hidden_days_before_protest=4,
        aggregation="daily",
    )
    assert len(actuals) == len(events)
    assert len(counterfactuals) == len(events)
    assert len(impacts) == len(events)
    for impact in impacts:
        assert isinstance(impact, pd.Series)
        assert impact.index.is_monotonic_increasing
        assert len(impact) == 4 + 7


def test_mean_impact_estimates():
    # get events and article counts for "Last Generation" in 2023
    events = get_acled_events(
        countries=["Germany"], start_date=date(2023, 7, 1), end_date=date(2023, 12, 31)
    )
    events = events[events["organizers"].apply(lambda x: "Last Generation" in x)]
    article_counts = get_genios_counts(
        '"Letzte Generation"', start_date=date(2023, 1, 1), end_date=date(2024, 3, 31)
    )
    impacts_df, warnings = estimate_mean_impact(
        events,
        article_counts,
        horizon=7,
        hidden_days_before_protest=4,
        aggregation="daily",
    )
    assert isinstance(impacts_df, pd.DataFrame)
    assert impacts_df.index.is_monotonic_increasing
    assert impacts_df.index[0] == -4
    assert impacts_df.index[-1] == 6
    assert len(impacts_df) == 4 + 7
    assert set(impacts_df.columns) == {"mean", "ci_lower", "ci_upper"}
    for i in range(-4, -1):
        mean = impacts_df.loc[i, "mean"]
        assert -50 <= mean <= 50
        # ci_lower = impacts_df.loc[i, "ci_lower"]
        # assert ci_lower < 0
        # ci_upper = impacts_df.loc[i, "ci_upper"]
        # assert ci_upper > 0
    for i in range(1, 7):
        mean = impacts_df.loc[i, "mean"]
        assert mean > 20
        # ci_lower = impacts_df.loc[i, "ci_lower"]
        # assert ci_lower > 0
        # ci_upper = impacts_df.loc[i, "ci_upper"]
        # assert ci_upper > 0
