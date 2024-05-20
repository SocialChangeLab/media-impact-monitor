from datetime import date

import pandas as pd

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.sentiment import sentiment
from media_impact_monitor.types_ import TrendSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.parallel import parallel_tqdm


@cache
def get_sentiment_trend(q: TrendSearch) -> pd.DataFrame:
    assert q.trend_type == "sentiment"
    assert (
        q.media_source == "news_online"
    ), "Currently only news_online has fulltexts available, which are necessary for sentiment analysis."
    start_date = date(2024, 4, 1)
    query = '"letzte generation"'
    fulltexts = get_mediacloud_fulltexts(
        query=query, start_date=start_date, countries=["Germany"]
    )
    responses = parallel_tqdm(sentiment, fulltexts["text"], desc="Sentiment analysis")
    fulltexts["sentiment"] = [r["sentiment"] for r in responses]
    fulltexts["sentiment_reasoning"] = [r["reasoning"] for r in responses]
    # aggregate positive, neutral, negative sentiments by day
    fulltexts["sentiment"] = fulltexts["sentiment"].astype(int)
    fulltexts = (
        fulltexts.groupby("publish_date")["sentiment"]
        .value_counts()
        .unstack()
        .fillna(0)
    )
    fulltexts.columns = ["negative", "neutral", "positive"]
    fulltexts.index = pd.to_datetime(fulltexts.index).date
    fulltexts.index.name = "date"
    return fulltexts
