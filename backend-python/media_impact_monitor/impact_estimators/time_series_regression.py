import re
from itertools import chain
from math import ceil

import matplotlib.pyplot as plt
import pandas as pd
import statsmodels.api as sm
from tqdm.auto import tqdm

from media_impact_monitor.types_ import Aggregation


def add_lags(df: pd.DataFrame, lags: list[int]):
    """Add new columns with lagged values."""
    if lags == []:
        return df
    lags = pd.concat([df.shift(lag).add_suffix(f"_lag{lag}") for lag in lags], axis=1)
    return pd.concat([df, lags], axis=1)


def add_emws(df: pd.DataFrame, spans=[1, 2, 7, 30, 90, 365]):
    """Add new columns with exponentially weighted moving averages."""
    emws = pd.DataFrame(
        {
            f"{col}_emw{i}": df.shift(1).ewm(halflife=i).mean().iloc[:, 0]
            for i in spans
            for col in df.columns
        }
    )
    return pd.concat([df, emws], axis=1)


def add_weekday_dummies(df: pd.DataFrame):
    """Add dummies for weekdays."""
    weekdays = pd.to_datetime(df.index).weekday
    weekday_dummies = pd.get_dummies(weekdays, prefix="weekday", dtype=int)
    weekday_dummies.index = df.index
    return pd.concat([df, weekday_dummies], axis=1)


def regress(
    protest_df: pd.DataFrame,
    media_df: pd.DataFrame,
    day: int = 0,
    lags: list[int] = [],
    cumulative: bool = False,
):
    """Get regression result where the outcome is `day` days after the treatment."""
    media_df = pd.DataFrame(media_df, columns=["count"])
    # protest_df = add_lags(protest_df, lags=[])
    media_df = add_lags(media_df, lags=lags)
    # protest_df = add_emws(protest_df)
    # media_df = add_emws(media_df, spans=[14])
    df = pd.concat([protest_df, media_df], axis=1)
    df = add_weekday_dummies(df)
    treatment = "protest"
    outcome = "count"
    df[outcome] = df[outcome].shift(-day)
    if cumulative:
        # TODO write tests for this
        if day < 0:
            indexer = pd.api.indexers.FixedForwardWindowIndexer(window_size=-day)
            df[outcome] = -df[outcome].rolling(window=indexer).sum()
        else:
            df[outcome] = df[outcome].rolling(day + 1).sum()
    df = df.dropna()
    placebo = False
    if placebo:
        df[treatment] = df.sample(frac=1)[treatment].to_list()
    X = df.drop(columns=[outcome])
    y = df[outcome]
    model = sm.OLS(y, sm.add_constant(X))
    model = model.fit(cov_type="HC3")
    alpha = 0.1
    return {
        "date": day,
        "mean": model.params[treatment],
        "p": model.pvalues[treatment],
        "ci_lower": model.conf_int(alpha=alpha)[0][treatment],
        "ci_upper": model.conf_int(alpha=alpha)[1][treatment],
    }


def agg_protests(df: pd.DataFrame):
    start = df["date"].min()  # HACK
    end = df["date"].max()  # HACK
    df = df.groupby("date")["date"].count().to_frame("protest")
    idx = pd.date_range(start=start, end=end)
    df = df.reindex(idx).fillna(0)
    return df


def estimate_impact(
    events: pd.DataFrame,
    article_counts: pd.Series,
    aggregation: Aggregation,
    cumulative: bool = True,
    lags: list[int] = [],
    outcome_days: list[int] = range(-14, 14),
):
    protest_df = agg_protests(events)
    n = protest_df["protest"].sum()
    limitations = [f"There have only been {n} protests."]
    impacts = pd.DataFrame(
        [
            regress(
                protest_df, article_counts, day=day, lags=lags, cumulative=cumulative
            )
            for day in outcome_days
        ]
    )
    impacts = impacts.set_index("date")[["mean", "ci_lower", "ci_upper"]]
    return impacts, limitations
