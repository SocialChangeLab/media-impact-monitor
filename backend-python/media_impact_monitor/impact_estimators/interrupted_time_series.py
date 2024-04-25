import warnings
from datetime import date

import numpy as np
import pandas as pd
from mlforecast import MLForecast
from mlforecast.lag_transforms import RollingMean
from sklearn.ensemble import RandomForestRegressor
from tqdm import tqdm

from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.parallel import parallel_tqdm

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


def predict_with_ml(train: pd.DataFrame, horizon: int):
    train = (  # convert to format for mlforecast
        train.copy()
        .reset_index()
        .rename(columns={"date": "ds", "count": "y"})
        .assign(unique_id=0)
    )
    fcst = MLForecast(
        models=[
            # LinearRegression(),
            # BayesianRidge(),
            # LassoLarsIC(),
            RandomForestRegressor(),
        ],
        freq="D",
        lags=[1],
        lag_transforms={1: [RollingMean(window_size=7)]},
        date_features=["dayofweek"],
    )
    fcst.fit(train)
    pred = fcst.predict(h=horizon)
    pred = (  # convert back from format for mlforecast
        pred.rename(columns={"RandomForestRegressor": "count", "ds": "date"})
        .drop(columns=["unique_id"])
        .set_index("date")
    )
    pred.index = pred.index.date
    return pred


@cache
def estimate_impact(
    event_date: date,
    df: pd.DataFrame,
    horizon: int,
    hidden_days_before_protest: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Calculate the impact of a protest event on the media coverage.

    Args:
        event_date: The date of the protest event.
        df: A DataFrame with a single column "count" and a DatetimeIndex.
        horizon: The number of days to forecast.
        hidden_days_before_protest: The number of days before the protest event to exclude from the training data.

    Returns:
        actual: The actual media coverage.
        counterfactual: The counterfactual media coverage.
        impact: The difference between the actual and counterfactual media coverage.
    """
    assert df.columns == ["count"]
    assert df.index.name == "date"
    # check that all values are numeric
    assert df.dtypes.apply(pd.api.types.is_numeric_dtype).all()

    event_date = event_date - pd.Timedelta(days=hidden_days_before_protest)
    train = df[df.index < event_date].copy()
    actual = df[
        (df.index >= event_date) & (df.index < event_date + pd.Timedelta(days=horizon))
    ]
    counterfactual = predict_with_arima(train, horizon)
    impact = actual - counterfactual
    return actual, counterfactual, impact


def estimate_impacts(
    events: pd.DataFrame,
    article_counts: pd.DataFrame,
    horizon: int,
    hidden_days_before_protest: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    def _estimate_impact(event_):
        i, event = event_
        return estimate_impact(
            event["date"], article_counts, horizon, hidden_days_before_protest
        )

    estimates = parallel_tqdm(
        _estimate_impact, events.iterrows(), total=events.shape[0], n_jobs=4
    )
    actuals, counterfactuals, impacts = zip(*estimates)
    return actuals, counterfactuals, impacts
