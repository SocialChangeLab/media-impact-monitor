import re
from itertools import chain
from math import ceil

import matplotlib.pyplot as plt
import pandas as pd
import statsmodels.api as sm
from data_processing.cache import memory
from data_processing.data import get_data
from data_processing.dates import end, start
from data_processing.movements import movement_aliases, movements
from data_processing.news.mediacloud import counts
from data_processing.paths import plots
from tqdm.auto import tqdm


def plot_media(movement: str):
    """Plot time series of media coverage for a movement."""
    query = make_query([movement] + movement_aliases[movement])
    df_media = counts(query)
    if df_media is None:
        return
    df_media.set_index("date").plot(figsize=(7, 3), title=movement)


def add_lags(df: pd.DataFrame, lags: list[int]):
    """Add new columns with lagged values."""
    lags = pd.concat([df.shift(lag).add_suffix(f"_lag{lag}") for lag in lags], axis=1)
    return pd.concat([df, lags], axis=1)


def add_emws(df: pd.DataFrame, spans=[1, 2, 7, 30, 90, 365]):
    """Add new columns with exponentially weighted moving averages."""
    emws = pd.DataFrame(
        {
            f"{col}_emw{i}": df.shift(1).ewm(span=i).mean().iloc[:, 0]
            for i in spans
            for col in df.columns
        }
    )
    return pd.concat([df, emws], axis=1)


def regress(
    protest_df: pd.DataFrame,
    media_df: pd.DataFrame,
    day: int = 0,
    lags: int = 14,
    cumulative: bool = False,
):
    """Get regression result where the outcome is `day` days after the treatment."""
    lags = range(1, lags + 1)
    protest_df = add_lags(protest_df, lags=lags)
    media_df = add_lags(media_df, lags=lags)
    # protest_df = add_emws(protest_df)
    # media_df = add_emws(media_df)
    treatment = "protest"
    outcome = "count"
    media_df[outcome] = media_df[outcome].shift(-day)
    if cumulative:
        if day < 0:
            indexer = pd.api.indexers.FixedForwardWindowIndexer(window_size=-day)
            media_df[outcome] = -media_df[outcome].rolling(window=indexer).sum()
        else:
            media_df[outcome] = media_df[outcome].rolling(day + 1).sum()
    df = pd.concat([protest_df, media_df], axis=1).dropna()
    X = df.drop(columns=[outcome])
    model = sm.OLS(df[outcome], sm.add_constant(X))
    model = model.fit(cov_type="HC3")
    return {
        "step": day,
        "coef": model.params[treatment],
        "p": model.pvalues[treatment],
        "ci_lo": model.conf_int()[0][treatment],
        "ci_up": model.conf_int()[1][treatment],
    }


def make_query(items: list[str]):
    query = " OR ".join([f'"{item}"' for item in items])
    # remove additions as in "Last Generation (Italy)"
    query = re.sub(r"\s*\(.*\)", "", query)
    return query


def agg_protests(df: pd.DataFrame):
    df = df.groupby("date")["date"].count().to_frame("protest")
    idx = pd.date_range(start=start, end=end)
    df = df.reindex(idx).fillna(0)
    return df


def regress_movement(
    df: pd.DataFrame,
    movement: str,
    lags: int = 14,
    outcome_days: list[int] = range(-14, 14),
):
    """Get protest and media data for one movement and obtain regression results for every outcome day."""
    if movement is not None:
        df = df[df["groups"].apply(lambda x: movement in x)]
    protest_df = agg_protests(df)
    n = protest_df["protest"].sum()
    aliases = (
        movements + list(chain(*movement_aliases.values()))
        if movement is None
        else [movement] + movement_aliases[movement]
    )
    query = make_query(aliases)
    media_df = counts(query)
    params = pd.concat(
        [
            pd.DataFrame(
                [
                    regress(
                        protest_df, media_df, day=day, lags=lags, cumulative=cumulative
                    )
                    for day in outcome_days
                ]
            ).assign(cumulative=cumulative)
            for cumulative in [False, True]
        ]
    )
    return n, params


def plot(results, cumulative=False):
    fig, ax = plt.subplots(ncols=2, nrows=ceil(len(results) / 2), figsize=(10, 15))
    for i, (title, (n, params)) in enumerate(results):
        axi = ax[i // 2, i % 2]
        if params is not None:
            params = params[params["cumulative"] == cumulative]
            color = "orange" if cumulative else "blue"
            axi.plot(params["step"], params["coef"], color=color)
            axi.fill_between(
                params["step"], params["ci_lo"], params["ci_up"], alpha=0.2, color=color
            )
        axi.axvline(0, color="black")
        axi.set_ylabel("Increase in media hits")
        axi.set_xlabel("Days after protest")
        title = "All Movements" if title is None else title
        axi.set_title(f"{title} (n={n:.0f})")
        axi.axhline(0, color="black", linestyle="--")
        axi.grid()
    fig.legend(
        ["Daily increase in media hits", "CI 95%"]
        if not cumulative
        else ["Cumulative increase in media hits", "CI 95%"],
        loc="lower center",
        ncol=2,
    )
    plt.tight_layout()
    plt.savefig(plots / ("all.png" if not cumulative else "all_cum.png"))


if __name__ == "__main__":
    df = get_data()
    df = df[df["source"] == "ACLED"]
    results = [
        (movement, regress_movement(df, movement, lags=7, outcome_days=range(-2, 21)))
        for movement in tqdm([None] + movements)
    ]
    plot(results, cumulative=False)
    plot(results, cumulative=True)
