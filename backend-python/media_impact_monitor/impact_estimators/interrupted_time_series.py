import warnings
from datetime import date, timedelta

import pandas as pd

from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.parallel import parallel_tqdm
from media_impact_monitor.util.stats import confidence_interval_ttest

warnings.simplefilter(action="ignore", category=FutureWarning)

from statsforecast import StatsForecast
from statsforecast.models import ARIMA


def predict_with_arima(train: pd.DataFrame, horizon: int):
    train = (  # convert to format for statsforecast
        train.copy()
        .reset_index()
        .rename(columns={"date": "ds", "count": "y"})
        .assign(unique_id=0)
    )
    fcst = StatsForecast(
        models=[
            ARIMA(
                order=(1, 1, 1),
                season_length=7,
                seasonal_order=(1, 1, 1),
            ),
        ],
        freq="D",
        n_jobs=4,
    )
    fcst.fit(train)
    pred = fcst.predict(h=horizon)
    pred = (  # convert back from format for statsforecast
        pred.rename(columns={"ARIMA": "count", "ds": "date"})
        .reset_index(drop=True)
        .set_index("date")
    )
    pred.index = pred.index.date
    return pred


@cache
def estimate_impact(
    event_date: date,
    ds: pd.DataFrame,
    horizon: int,
    hidden_days_before_protest: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Calculate the impact of a protest event on the media coverage.

    Args:
        event_date: The date of the protest event.
        df: A DataFrame with a single column "count" and a datetime.date index.
        horizon: The number of days to forecast.
        hidden_days_before_protest: The number of days before the protest event to exclude from the training data.

    Returns:
        actual: The actual media coverage.
        counterfactual: The counterfactual media coverage.
        impact: The difference between the actual and counterfactual media coverage.
    """
    assert isinstance(ds, pd.Series)
    assert ds.name == "count"
    assert ds.index.name == "date"
    # check that all values are numeric
    # assert df.dtypes.apply(pd.api.types.is_numeric_dtype).all()
    assert pd.api.types.is_numeric_dtype(ds.dtypes)

    # adjust event_date and horizon to account for hidden_days_before_protest
    _start_date = event_date - timedelta(days=hidden_days_before_protest)
    _horizon = horizon + hidden_days_before_protest

    # define train and test (actual) data
    train = ds[ds.index < _start_date].copy()
    actual = ds[
        (ds.index >= _start_date) & (ds.index < _start_date + timedelta(days=_horizon))
    ]

    # predict and calculate impact
    counterfactual = predict_with_arima(train, _horizon)
    impact = actual - counterfactual
    return actual, counterfactual, impact


def estimate_impacts(
    events: pd.DataFrame,
    article_counts: pd.Series,
    horizon: int,
    hidden_days_before_protest: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    def _estimate_impact(event_):
        i, event = event_
        return estimate_impact(
            event["date"], article_counts, horizon, hidden_days_before_protest
        )

    estimates = parallel_tqdm(
        _estimate_impact, events.iterrows(), total=events.shape[0], n_jobs=1
    )
    actuals, counterfactuals, impacts = zip(*estimates)
    return actuals, counterfactuals, impacts


def estimate_mean_impact(
    events: pd.DataFrame,
    article_counts: pd.DataFrame,
    horizon: int,
    hidden_days_before_protest: int,
    cumulative: bool = True,
) -> pd.DataFrame:
    # output: dataframe with columns mean, ci_upper, ci_lower
    # and index from -hidden_days_before_protest to horizon
    actuals, counterfactuals, impacts = estimate_impacts(
        events, article_counts, horizon, hidden_days_before_protest
    )
    impacts_df = pd.concat([df.reset_index(drop=True) for df in impacts], axis=1)
    impacts_df.index = impacts_df.index - hidden_days_before_protest
    if cumulative:
        impacts_df = impacts_df.cumsum()
    average = impacts_df.mean(axis=1)
    ci_lower = impacts_df.apply(lambda x: confidence_interval_ttest(x, 0.95)[0], axis=1)
    ci_upper = impacts_df.apply(lambda x: confidence_interval_ttest(x, 0.95)[1], axis=1)
    return pd.DataFrame({"mean": average, "ci_lower": ci_lower, "ci_upper": ci_upper})
