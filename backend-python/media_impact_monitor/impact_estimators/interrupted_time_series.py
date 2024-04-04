from datetime import date

import causalpy as cp
import pandas as pd
from sklearn.ensemble import (  # noqa: F401
    GradientBoostingRegressor,
    RandomForestRegressor,
)
from sklearn.linear_model import (  # noqa: F401
    ElasticNet,
    Lasso,
    LinearRegression,
    Ridge,
)


def calculate_impact(event_date: date, df: pd.DataFrame):
    assert df.columns == ["count"]
    assert df.index.name == "date"
    assert isinstance(df.index, pd.DatetimeIndex)
    # add lags for the past 7 days
    df = df.sort_index()
    for i in range(1, 8):
        df[f"count_lag_{i}"] = df["count"].shift(i)
    lag_params = [f"count_lag_{i}" for i in range(1, 8)]
    lag_params = " + ".join(lag_params)
    # add weekday dummies
    df["weekday"] = df.index.weekday
    df = pd.get_dummies(df, columns=["weekday"], drop_first=True, dtype=int)
    weekday_params = [f"weekday_{i}" for i in range(1, 7)]
    weekday_params = " + ".join(weekday_params)
    formula = f"count ~ 1 + {lag_params} + {weekday_params}"
    # crop the dataframe to 14 days before and after the event
    df = df.loc[
        event_date - pd.Timedelta(days=182) : event_date + pd.Timedelta(days=28)
    ]
    df = df.dropna()
    # check that all values are numeric
    assert df.dtypes.apply(pd.api.types.is_numeric_dtype).all()
    result = cp.skl_experiments.InterruptedTimeSeries(
        df,
        pd.to_datetime(event_date),
        formula=formula,
        # model=LinearRegression(),
        # model=Ridge(),
        # model=Lasso(),
        model=RandomForestRegressor(),
        # model=GradientBoostingRegressor(),
    )
    return result
