from media_impact_monitor.trends.topic_trend import get_topic_trend
import pandas as pd

from media_impact_monitor.trends.keyword_trend import get_keyword_trend
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.types_ import Trend, TrendSearch


def get_trend(q: TrendSearch, as_json=True) -> Trend | pd.DataFrame | None:
    match q.trend_type:
        case "keywords":
            df, lims = get_keyword_trend(q)
        case "sentiment":
            df, lims = get_sentiment_trend(q)
        case "topic":
            df, lims = get_topic_trend(q)
        case _:
            raise ValueError(f"Unsupported trend type: {q.trend_type}")
    match df:
        case pd.DataFrame():
            df.index = pd.to_datetime(df.index)
            if q.aggregation == "weekly":
                df = df.resample("W").sum()
            elif q.aggregation == "monthly":
                df = df.resample("M").sum()
            df.index = df.index.date
            df.index.name = "date"
            if not as_json:
                return df
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
            if not as_json:
                return None
            return Trend(applicability=False, limitations=lims, trends=None)
