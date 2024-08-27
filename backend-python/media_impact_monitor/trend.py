from datetime import date
from media_impact_monitor.trends.topic_trend import get_topic_trend
from media_impact_monitor.util.date import verify_dates
import pandas as pd

from media_impact_monitor.trends.keyword_trend import get_keyword_trend
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.types_ import Trend, TrendSearch
from media_impact_monitor.util.cache import cache


@cache
def _get_trend(q: TrendSearch) -> tuple[pd.DataFrame | None, list[str]]:
    match q.trend_type:
        case "keywords":
            df, lims = get_keyword_trend(q)
        case "sentiment":
            df, lims = get_sentiment_trend(q)
        case "topic":
            df, lims = get_topic_trend(q)
        case _:
            raise ValueError(f"Unsupported trend type: {q.trend_type}")
    return df, lims


def get_trend(q: TrendSearch) -> tuple[pd.DataFrame | None, list[str]]:
    # wrapper for better caching
    start_date = q.start_date
    end_date = q.end_date
    r = TrendSearch(**dict(q))  # copy q to avoid modifying the original
    r.start_date = date(2020, 1, 1)
    r.end_date = date.today()
    df, lims = _get_trend(r)
    if df is not None:
        df = df.loc[start_date:end_date]
    return df, lims


def get_trend_for_api(q: TrendSearch) -> Trend:
    verify_dates(q.start_date, q.end_date)
    df, lims = get_trend(q)
    match df:
        case pd.DataFrame():
            df.index = pd.to_datetime(df.index)
            idx = pd.date_range(start=q.start_date, end=q.end_date, freq="D")
            df = df.reindex(idx).fillna(0)
            if q.aggregation == "weekly":
                df = df.resample("W").sum()
            elif q.aggregation == "monthly":
                df = df.resample("M").sum()
            df.index = df.index.date
            df.index.name = "date"
            long_df = pd.melt(
                df.reset_index(),
                id_vars=["date"],
                var_name="topic",
                value_name="n_articles",
            )
            return Trend(
                applicability=True,
                limitations=lims,
                trends=long_df.to_dict(orient="records"),
            )
        case None:
            return Trend(applicability=False, limitations=lims, trends=None)
