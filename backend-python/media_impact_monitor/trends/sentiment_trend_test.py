from datetime import date

from media_impact_monitor.types_ import TrendSearch
import pandas as pd

from media_impact_monitor.fulltext_coding import (
    code_fulltext,
    get_aspect_sentiment,
)
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.api import _get_trend


def test_get_sentiment_trend_valid_input():
    df = get_sentiment_trend(
        TrendSearch(
            trend_type="sentiment",
            media_source="news_online",
            query='"letzte generation"',
            start_date=date(2024, 6, 1),
            end_date=date(2024, 6, 2),
        )
    )
    assert isinstance(df, pd.DataFrame), "The result should be a DataFrame"
    assert set(df.columns) == {
        "negative",
        "neutral",
        "positive",
    }, "DataFrame should have sentiment columns"


def test_get_sentiment_trend_topic():
    df = _get_trend(
        TrendSearch(
            trend_type="sentiment",
            media_source="news_online",
            topic="climate_change",
            start_date=date(2024, 5, 25),
            end_date=date(2024, 7, 24),
        )
    )
    assert isinstance(df, pd.DataFrame)
    assert set(df.columns) == {
        "negative",
        "neutral",
        "positive",
    }, "DataFrame should have sentiment columns"
    assert len(df) > 0
