import warnings
from datetime import date

import lightgbm as lgb
import pandas as pd
from mlforecast import MLForecast
from mlforecast.lag_transforms import ExpandingMean, RollingMean
from mlforecast.target_transforms import Differences
from sklearn.ensemble import GradientBoostingRegressor

from media_impact_monitor.util.cache import cache

warnings.simplefilter(action="ignore", category=FutureWarning)

from statsforecast import StatsForecast
from statsforecast.models import ARIMA


def predict_with_arima(train: pd.DataFrame, horizon: int):
    train = train.copy().reset_index()
    train["unique_id"] = 0
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
    fcst.fit(train, time_col="date", target_col="count")
    pred = fcst.predict(h=horizon)
    pred = (
        pred.rename(columns={"ARIMA": "count"})
        .drop(columns=["unique_id"])
        .set_index("date")
    )
    return pred


def predict_with_boosting(train: pd.DataFrame, horizon: int):
    train = train.copy().reset_index()
    train["unique_id"] = 0
    fcst = MLForecast(
        models=[
            # GradientBoostingRegressor(n_estimators=100),
            lgb.LGBMRegressor(n_estimators=100),
        ],
        freq="D",
        lags=[1, 2, 7],
        lag_transforms={
            1: [ExpandingMean()],
            2: [RollingMean(window_size=2)],
            7: [RollingMean(window_size=7)],
        },
        target_transforms=[Differences([1])],
    )
    prep = fcst.preprocess(train, time_col="date", target_col="count")
    print(prep)
    fcst.fit(train, time_col="date", target_col="count")
    pred = fcst.predict(h=horizon)
    pred = (
        # pred.rename(columns={"GradientBoostingRegressor": "count"})
        pred.rename(columns={"LGBMRegressor": "count"})
        .drop(columns=["unique_id"])
        .set_index("date")
    )
    return pred


@cache
def calculate_impact(
    event_date: date,
    df: pd.DataFrame,
    horizon: int = 14,
    hidden_days_before_protest: int = 3,
):
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
    assert isinstance(df.index, pd.DatetimeIndex)
    # check that all values are numeric
    assert df.dtypes.apply(pd.api.types.is_numeric_dtype).all()

    event_date = event_date - pd.Timedelta(days=hidden_days_before_protest)
    train = df[df.index < event_date].copy()
    actual = df[
        (df.index >= event_date) & (df.index < event_date + pd.Timedelta(days=horizon))
    ]
    counterfactual = predict_with_boosting(train, horizon)
    impact = actual - counterfactual
    return actual, counterfactual, impact
