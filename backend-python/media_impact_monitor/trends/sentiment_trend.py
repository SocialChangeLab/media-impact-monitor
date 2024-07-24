from datetime import date

import pandas as pd

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.fulltext_coding import code_fulltext
from media_impact_monitor.util.cache import cache


@cache
def get_sentiment_trend(
    end_date: date,
    query: str,
    start_date: date = date(2024, 5, 1),
    media_source: str = "news_online",
) -> pd.DataFrame | str:
    """
    Retrieves the sentiment trend for a given query and start date.

    Args:
        q (TrendSearch): The TrendSearch object containing the query and trend type.
        start_date (date): The start date for retrieving the sentiment trend.

    Returns:
        pd.DataFrame | str: A DataFrame containing the sentiment trend with columns for negative, neutral, and positive sentiments, indexed by date: or a string of limitations
    """
    if media_source != "news_online":
        return f"Sentiment trend requires fulltext analysis, which is only available for news_online, not {media_source}."
    query = '"letzte generation"'  # TODO
    cutoff = date(2024, 5, 1)
    if end_date < cutoff:
        return f"Sentiments are only available from {start_date} onwards."
    start_date = max(start_date or cutoff, cutoff) # don't get too many fulltexts

    print(start_date, end_date, query)
    fulltexts = get_mediacloud_fulltexts(
        query=query, start_date=start_date, end_date=end_date, countries=["Germany"]
    )
    coded_df = fulltexts["text"].apply(code_fulltext).apply(pd.Series)
    fulltexts = pd.concat([fulltexts, coded_df], axis=1)

    # aggregate positive, neutral, negative sentiments by day
    df = (
        fulltexts.groupby("date")["sentiment"].agg(
            negative=lambda x: (x == -1).sum(),
            neutral=lambda x: (x == 0).sum(),
            positive=lambda x: (x == 1).sum(),
        )
    )
    df.index = pd.to_datetime(df.index).date
    df.index.name = "date"
    return df
