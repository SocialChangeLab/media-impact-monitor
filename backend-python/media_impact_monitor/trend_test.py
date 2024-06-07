import pandas as pd
import pytest
from pydantic import ValidationError

from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import TrendSearch


@pytest.mark.skip(reason="google trends currently blocked on ci")
def test_get_trend_keywords():
    trend_search = TrendSearch(
        trend_type="keywords",
        media_source="web_google",
        start_date="2021-01-01",
        end_date="2021-01-31",
        query="climate change",
    )
    df = get_trend(trend_search)
    assert isinstance(df, pd.DataFrame)


def test_get_trend_unsupported_media_source():
    with pytest.raises(ValidationError):
        trend_search = TrendSearch(
            trend_type="keywords",
            media_source="unsupported_source",
            start_date="2021-01-01",
            end_date="2021-01-31",
            query="climate change",
        )
        get_trend(trend_search)


def test_get_trend_unsupported_trend_type():
    with pytest.raises(ValidationError):
        trend_search = TrendSearch(
            trend_type="unsupported_type",
            media_source="news_print",
            start_date="2021-01-01",
            end_date="2021-01-31",
            query="climate change",
        )
        get_trend(trend_search)
