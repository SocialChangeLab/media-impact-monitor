import warnings
from datetime import date

import pandas as pd

from media_impact_monitor.util.cache import cache

warnings.simplefilter(action="ignore", category=FutureWarning)
from statsforecast import StatsForecast
from statsforecast.models import ARIMA


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
    df = df.copy().reset_index()
    df["unique_id"] = 0
    event_date = event_date - pd.Timedelta(days=hidden_days_before_protest)
    train = df[df["date"] < event_date].copy()
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
    actual = df[
        (df["date"] >= event_date)
        & (df["date"] < event_date + pd.Timedelta(days=horizon))
    ].drop(columns="unique_id")
    counterfactual = fcst.predict(h=horizon).rename(columns={"ARIMA": "count"})
    impact = actual.set_index("date") - counterfactual.set_index("date")
    return actual, counterfactual, impact
