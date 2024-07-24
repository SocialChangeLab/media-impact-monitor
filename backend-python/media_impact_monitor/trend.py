import pandas as pd

from media_impact_monitor.trends.keyword_trend import get_keyword_trend
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.types_ import Trend, TrendSearch


def get_trend(q: TrendSearch) -> Trend:
    match q.trend_type:
        case "keywords":
            df = get_keyword_trend(q)
        case "sentiment":
            df = get_sentiment_trend(
                query=q.query,
                start_date=q.start_date,
                end_date=q.end_date,
                media_source=q.media_source,
            )
        case _:
            raise ValueError(f"Unsupported trend type: {q.trend_type}")
    match df:
        case pd.DataFrame():
            long_df = pd.melt(
                df.reset_index(), id_vars=["date"], var_name="topic", value_name="n_articles"
            )
            return Trend(applicability=True, limitations=[], trends=long_df.to_dict(orient="records"))
        case str:
            return Trend(applicability=False, limitations=[df], trends=None)
    
