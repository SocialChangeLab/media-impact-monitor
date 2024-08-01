from media_impact_monitor.util.cache import cache
import pandas as pd
import numpy as np
from scipy import stats


def correlate(
    protest_df: pd.DataFrame,
    media_df: pd.DataFrame,
    day: int = 0,
    cumulative: bool = False,
):
    """
    Compute correlation between protest and media data, with optional time offset and cumulative calculation.

    Parameters:
    - protest_df: DataFrame containing protest data
    - media_df: DataFrame containing media data
    - day: Number of days to offset media data (default: 0)
    - cumulative: Whether to use cumulative sums (default: False)

    Returns:
    Dictionary containing correlation results and statistics
    """
    media_df = pd.DataFrame(media_df, columns=["count"])
    treatment = "protest"
    outcome = "count"
    df = pd.concat([protest_df, media_df], axis=1)
    df[outcome] = df[outcome].shift(-day)

    if cumulative:
        if day < 0:
            indexer = pd.api.indexers.FixedForwardWindowIndexer(window_size=-day)
            df[outcome] = -df[outcome].rolling(window=indexer).sum()
        else:
            df[outcome] = df[outcome].rolling(day + 1).sum()
    df = df.dropna()
    overall_corr = df[treatment].corr(df[outcome])

    # Compute confidence interval using Fisher's z-transformation
    # TODO: this is from Claude, haven't checked it
    n = len(df)
    z = np.arctanh(overall_corr)
    se = 1 / np.sqrt(n - 3)
    ci_lower, ci_upper = np.tanh([z - 1.96 * se, z + 1.96 * se])

    # Compute p-value
    t_stat = overall_corr * np.sqrt((n - 2) / (1 - overall_corr**2))
    p_value = 2 * (1 - stats.t.cdf(abs(t_stat), n - 2))

    return {
        "date": day,
        "mean": overall_corr,
        "p_value": p_value,
        "ci_lower": ci_lower,
        "ci_upper": ci_upper,
    }


def agg_protests(df: pd.DataFrame):
    start = df["date"].min()  # HACK
    end = df["date"].max()  # HACK
    df = df.groupby("date")["date"].count().to_frame("protest")
    idx = pd.date_range(start=start, end=end)
    df = df.reindex(idx).fillna(0)
    return df


@cache
def estimate_impact(
    events: pd.DataFrame,
    article_counts: pd.Series,
    cumulative: bool = True,
    outcome_days: list[int] = range(-14, 14),
):
    protest_df = agg_protests(events)
    n = protest_df["protest"].sum()
    limitations = [f"There have only been {n} protests."]
    impacts = pd.DataFrame(
        [
            correlate(
                protest_df,
                article_counts,
                day=day,
                cumulative=cumulative,
            )
            for day in outcome_days
        ]
    )
    impacts = impacts.set_index("date")
    return impacts, limitations
