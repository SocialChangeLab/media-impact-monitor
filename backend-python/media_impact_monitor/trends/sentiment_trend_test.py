from datetime import date

import pandas as pd

from media_impact_monitor.fulltext_coding import (
    code_fulltext,
    get_aspect_sentiment,
)
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend

def test_get_sentiment_trend_valid_input():
    df = get_sentiment_trend(
        start_date=date(2024, 6, 1),
        end_date=date(2024, 6, 2),
        query='"letzte generation"',
        media_source="news_online",
    )
    assert isinstance(df, pd.DataFrame), "The result should be a DataFrame"
    assert set(df.columns) == {"negative", "neutral", "positive"}, "DataFrame should have sentiment columns"

def test_get_sentiment_trend_invalid_media_source():
    result = get_sentiment_trend(
        start_date=date(2024, 6, 1),
        end_date=date(2024, 6, 2),
        query='"letzte generation"',
        media_source="social_media",
    )
    assert isinstance(result, str), "The result should be a string for invalid media sources"

test_get_sentiment_trend_valid_input()
test_get_sentiment_trend_invalid_media_source()
