from datetime import date

import causalpy as cp
import pandas as pd
from sklearn.linear_model import LinearRegression


def calculate_impact(event_date: date, df: pd.DataFrame, with_uncertainty: bool = True):
    assert df.columns == ["count"]
    assert df.index.name == "date"
    assert isinstance(df.index, pd.DatetimeIndex)
    # add lags for the past 7 days
    df = df.sort_index()
    for i in range(1, 8):
        df[f"count_lag_{i}"] = df["count"].shift(i)
    lag_params = [f"count_lag_{i}" for i in range(1, 8)]
    lag_params = " + ".join(lag_params)
    # crop the dataframe to 14 days before and after the event
    df = df.loc[
        event_date - pd.Timedelta(days=182) : event_date + pd.Timedelta(days=28)
    ]
    formula = f"count ~ 1 + {lag_params}"
    df = df.dropna()
    # fit the interrupted time series model
    if with_uncertainty:
        result = cp.pymc_experiments.InterruptedTimeSeries(
            df,
            pd.to_datetime(event_date),
            formula=formula,
            model=cp.pymc_models.LinearRegression(sample_kwargs={"random_seed": 0}),
        )
    else:
        result = cp.skl_experiments.InterruptedTimeSeries(
            df,
            pd.to_datetime(event_date),
            formula=formula,
            model=LinearRegression(),
        )
    return result
