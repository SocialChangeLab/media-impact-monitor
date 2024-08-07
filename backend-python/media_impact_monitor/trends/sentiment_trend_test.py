from datetime import date

import pandas as pd

from media_impact_monitor.api import _get_trend
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.types_ import TrendSearch


def test_get_sentiment_trend_valid_input():
    df = get_sentiment_trend(
        TrendSearch(
            trend_type="sentiment",
            topic="climate_change",
            sentiment_target="activism",
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
