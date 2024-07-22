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
) -> pd.DataFrame:
    """
    Retrieves the sentiment trend for a given query and start date.

    Args:
        q (TrendSearch): The TrendSearch object containing the query and trend type.
        start_date (date): The start date for retrieving the sentiment trend.

    Returns:
        pd.DataFrame: A DataFrame containing the sentiment trend with columns for negative, neutral, and positive sentiments, indexed by date.
    """
    assert (
        media_source == "news_online"
    ), "Only news_online has fulltexts, which are necessary for sentiment analysis."
    query = '"letzte generation"'  # TODO
    print(start_date, end_date, query)
    fulltexts = get_mediacloud_fulltexts(
        query=query, start_date=start_date, end_date=end_date, countries=["Germany"]
    )
    coded_df = fulltexts["text"].apply(code_fulltext).apply(pd.Series)
    fulltexts = pd.concat([fulltexts, coded_df], axis=1)

    # aggregate positive, neutral, negative sentiments by day
    fulltexts = (
        fulltexts.groupby("date")["sentiment"].value_counts().unstack().fillna(0)
    )
    fulltexts.columns = ["negative", "neutral", "positive"]
    fulltexts.index = pd.to_datetime(fulltexts.index).date
    fulltexts.index.name = "date"
    return fulltexts
