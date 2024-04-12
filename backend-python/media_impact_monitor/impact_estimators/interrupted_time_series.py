import warnings
from datetime import date

import lightgbm as lgb
import numpy as np
import pandas as pd
from mlforecast import MLForecast
from mlforecast.auto import (
    AutoLightGBM,
    AutoLinearRegression,
    AutoMLForecast,
    AutoModel,
    AutoRandomForest,
    AutoRidge,
)
from mlforecast.lag_transforms import ExpandingMean, RollingMean
from mlforecast.target_transforms import Differences
from sklearn.ensemble import GradientBoostingRegressor, HistGradientBoostingRegressor
from sklearn.linear_model import BayesianRidge, LassoLarsIC, LinearRegression
from tqdm import tqdm

from media_impact_monitor.util.cache import cache

warnings.simplefilter(action="ignore", category=FutureWarning)

from statsforecast import StatsForecast
from statsforecast.models import ARIMA


def predict_with_arima(train: pd.DataFrame, horizon: int):
    train = (
        train.copy()
        .reset_index()
        .rename(columns={"date": "ds", "count": "y"})
        .assign(unique_id=0)
    )
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
    fcst.fit(train)
    pred = fcst.predict(h=horizon)
    pred = (
        pred.rename(columns={"ARIMA": "count", "ds": "date"})
        .drop(columns=["unique_id"])
        .set_index("date")
    )
    return pred


def optimize(df, horizon):
    df = (
        df.copy()
        .reset_index()
        .rename(columns={"date": "ds", "count": "y"})
        .assign(unique_id=0)
    )
    auto_mlf = AutoMLForecast(
        models={
            "lgb": AutoLightGBM(),
            "ridge": AutoRidge(),
        },
        freq="D",
        season_length=7,
    )
    auto_mlf.fit(
        df,
        n_windows=2,
        h=horizon,
        num_samples=2,
    )
    return auto_mlf


def predict_with_ml(train: pd.DataFrame, horizon: int, auto_mlf):
    train = (
        train.copy()
        .reset_index()
        .rename(columns={"date": "ds", "count": "y"})
        .assign(unique_id=0)
    )
    pred = auto_mlf.predict(h=horizon)
    pred = (
        pred.rename(columns={"lgb": "count", "ds": "date"})
        .drop(columns=["unique_id"])
        .set_index("date")
    )
    return pred


# @cache
def calculate_impact(
    event_date: date,
    df: pd.DataFrame,
    horizon: int,
    hidden_days_before_protest: int,
    auto_mlf,
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
    counterfactual = predict_with_ml(train, horizon, auto_mlf)
    impact = actual - counterfactual
    return actual, counterfactual, impact


def calculate_impacts(events, article_counts, horizon=14):
    first_event_date = events["date"].min()
    df_opt = article_counts[
        article_counts.index < first_event_date - pd.Timedelta(days=28)
    ]
    auto_mlf = optimize(df_opt, horizon)
    print(auto_mlf.results_[0].best_trial)
    actuals = []
    counterfactuals = []
    impacts = []
    for _, event in tqdm(events.iterrows(), total=events.shape[0]):
        actual, counterfactual, impact = calculate_impact(
            event["date"], article_counts, horizon, 0, auto_mlf
        )
        actuals.append(actual["count"])
        counterfactuals.append(counterfactual["count"])
        impacts.append(impact["count"])
    print([a.shape for a in actuals])
    actuals = np.array(actuals)
    counterfactuals = np.array(counterfactuals)
    impacts = np.array(impacts)
    return actuals, counterfactuals, impacts
