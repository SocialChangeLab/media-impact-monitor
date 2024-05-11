import pandas as pd

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_counts,
)
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.web.google_trends import get_google_trends_counts
from media_impact_monitor.types_ import TrendSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.date import verify_dates


@cache
def get_trend(q: TrendSearch) -> pd.Series:
    assert q.trend_type == "keywords", "Only keywords are supported."
    match q.media_source:
        case "news_online":
            df = get_mediacloud_counts(query=q.query)
        case "news_print":
            df = get_genios_counts(query=q.query)
        case "web_google":
            df = get_google_trends_counts(query=q.query)
        case _:
            raise ValueError(f"Unsupported media source: {q.media_source}")
    return df
