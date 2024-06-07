from datetime import date

import pandas as pd
import pytest

from media_impact_monitor.fulltext_coding import (
    code_fulltext,
    get_aspect_sentiment,
)
from media_impact_monitor.trends.sentiment_trend import get_sentiment_trend
from media_impact_monitor.types_ import TrendSearch

# def test_get_sentiment_trend_defaults():
#     senti = get_sentiment_trend(
#         TrendSearch(
#             trend_type="sentiment", media_source="news_online", topic="climate_change"
#         )
#     )


# def test_get_sentiment_classification():
#     get_sentiment_classification()


## Load test data for quicker testing
# texts = pd.read_pickle("data/test_data/fulltexts.pkl")

# def test_get_aspect_sentiment():
#     get_aspect_sentiment(text=texts["text"].iloc[1], aspect="protest")
#     get_aspect_sentiment(text=texts["text"].iloc[1], aspect="climate change")


# def test_get_aspect_sentiment_unsupported_aspect():
#     with pytest.raises(AssertionError):
#         get_aspect_sentiment(text=texts["text"].iloc[0], aspect="other")
