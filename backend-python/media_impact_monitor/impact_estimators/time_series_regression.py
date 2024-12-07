from collections import Counter
from itertools import chain

import pandas as pd
import statsmodels.api as sm


def add_lags(df: pd.DataFrame, lags: list[int]):
    """Add new columns with lagged values."""
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
    lags: int = 14,
    cumulative: bool = False,
):
    """Get regression result where the outcome is `day` days after the treatment."""
    lags = range(1, lags + 1)
    outcomes = media_df.columns

    placebo = False
    if placebo:
        protest_df = protest_df.copy().sample(frac=1)
    results = {}
    protest_df = add_lags(protest_df, lags=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    media_df = add_lags(media_df, lags=[4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    # protest_df = add_emws(protest_df)
    # media_df = add_emws(media_df, spans=[14])
    df = pd.concat([protest_df, media_df], axis=1)
    df = add_weekday_dummies(df)
    for outcome in outcomes:
        df[outcome] = df[outcome].shift(-day)
        if cumulative:
            # TODO write tests for this
            if day < 0:
                indexer = pd.api.indexers.FixedForwardWindowIndexer(window_size=-day)
                df[outcome] = -df[outcome].rolling(window=indexer).sum()
            else:
                df[outcome] = df[outcome].rolling(day + 1).sum()
        df = df.dropna()
        X = df.drop(columns=[outcome])
        y = df[outcome]
        model = sm.OLS(y, sm.add_constant(X))
        model = model.fit(cov_type="HC3")
        alpha = 0.1
        results[outcome] = {}
        for org in protest_df.columns:
            results[outcome][org] = {
                "date": day,
                "mean": model.params[org],
                "p_value": model.pvalues[org],
                "ci_lower": model.conf_int(alpha=alpha)[0][org],
                "ci_upper": model.conf_int(alpha=alpha)[1][org],
            }
    return results


def agg_protests(events: pd.DataFrame):
    start = events["date"].min()  # HACK
    end = events["date"].max()  # HACK
    # we want to reduce the amount of organizers for our simple regression
    # (when using multilevel models later, we can relax this)
    # only use primary organizers for each event
    primary_orgs = events["organizers"].apply(lambda x: x[0] if x else None)
    # only keep most frequent organizers
    orgs = [k for k, v in Counter(primary_orgs).items() if k and v > 10]
    # create dummy columns for each organizer
    orgs_df = pd.DataFrame({org: primary_orgs == org for org in orgs})
    orgs_df["date"] = events["date"]
    orgs_df = orgs_df.set_index("date")
    # create time series by counting protests per day for each organizer
    ts = orgs_df.groupby("date").agg({org: "any" for org in orgs}).astype(int)
    idx = pd.date_range(start=start, end=end)
    ts = ts.reindex(idx).fillna(0)
    return ts


def estimate_impact(
    events: pd.DataFrame,
    article_counts: pd.Series,
    cumulative: bool = True,
    lags: int = 14,
    outcome_days: list[int] = range(-14, 14),
):
    protest_df = agg_protests(events)
    return regress(
        protest_df, article_counts, day=7, lags=lags, cumulative=cumulative
    ), []
    # TODO: do this per day:
    impacts = pd.DataFrame(
        [
            regress(
                protest_df, article_counts, day=day, lags=lags, cumulative=cumulative
            )
            for day in outcome_days
        ]
    )
    impacts = impacts.set_index("date")[["mean", "ci_lower", "ci_upper", "p_value"]]
    limitations = []
    return impacts, limitations
