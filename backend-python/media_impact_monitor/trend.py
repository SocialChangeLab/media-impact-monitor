from datetime import date

import pandas as pd

from media_impact_monitor.trends.keyword_trend import get_keyword_trend
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.types_ import TrendSearch


def get_trend(q: TrendSearch) -> pd.DataFrame:
    match q.trend_type:
        case "keywords":
            return get_keyword_trend(q)
        case "sentiment":
            return get_sentiment_trend(
                query=q.query,
                end_date=q.end_date,
                media_source=q.media_source,
            )
        case _:
            raise ValueError(f"Unsupported trend type: {q.trend_type}")
