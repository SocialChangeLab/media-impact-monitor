import pandas as pd

from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.types_ import FulltextSearch, TrendSearch
from media_impact_monitor.util.cache import cache


@cache
def get_sentiment_trend(q: TrendSearch) -> pd.DataFrame | str:
    """
    Retrieves the sentiment trend for a given query and start date.

    Args:
        q (TrendSearch): The TrendSearch object containing the query and trend type.
        start_date (date): The start date for retrieving the sentiment trend.

    Returns:
        pd.DataFrame | str: A DataFrame containing the sentiment trend with columns for negative, neutral, and positive sentiments, indexed by date: or a string of limitations
    """
    if q.media_source != "news_online":
        return f"Sentiment trend requires fulltext analysis, which is only available for news_online, not {q.media_source}."
    assert q.topic in ["activism", "policy"]
    field = f"{q.topic}_sentiment"
    params = dict(q)
    del params["trend_type"]
    del params["aggregation"]
    params["topic"] = "climate_change"
    fulltexts = get_fulltexts(FulltextSearch(**params))

    # aggregate positive, neutral, negative sentiments by day
    df = fulltexts.groupby("date")[field].agg(
        negative=lambda x: (x == -1).sum(),
        neutral=lambda x: (x == 0).sum(),
        positive=lambda x: (x == 1).sum(),
    )
    df.index = pd.to_datetime(df.index).date
    df.index.name = "date"
    return df
