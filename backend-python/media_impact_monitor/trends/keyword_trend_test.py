from media_impact_monitor.trends.keyword_trend import topic_queries, get_keyword_trend
from media_impact_monitor.types_ import TrendSearch
from datetime import date
import pytest
import pandas as pd


def test_topic_queries():
    for media_source in ["news_online", "news_print"]:
        queries = topic_queries(media_source)
        assert queries["climate science"].startswith(
            "klimaforsch* OR klimawissenschaft*"
        )
        assert queries["climate policy"].startswith(
            "klimapoliti* OR klimaneutral* OR klimaziel*"
        )
        assert '"erneuerbare energie*"' in queries["climate policy"]
    queries = topic_queries("web_google")
    assert "+erderwärmung" in queries["climate science"]
    # assert "-\\*protest*" in queries["all_excl_activism"]
    # assert "+klimawandel" in queries["all_excl_activism"]


def test_get_keyword_trend():
    q = TrendSearch(
        trend_type="keywords",
        media_source="news_print",
        topic="climate_change",
        start_date=date(2023, 1, 1),
        end_date=date(2023, 12, 31),
    )

    df, limitations = get_keyword_trend(q)

    assert df is not None, "DataFrame should not be None"
    assert isinstance(df, pd.DataFrame), "Result should be a DataFrame"
    assert not df.empty, "DataFrame should not be empty"

    expected_columns = [
        "climate policy",
        "climate science",
        "climate crisis framing",
        "climate activism",
    ]
    assert all(
        col in df.columns for col in expected_columns
    ), "DataFrame should contain expected columns"

    assert df.index.name == "date", "Index name should be 'date'"
    assert df.index.is_monotonic_increasing, "Index should be monotonically increasing"

    assert (df >= 0).all().all(), "All values should be non-negative"

    assert isinstance(limitations, list), "Limitations should be a list"


@pytest.mark.parametrize("media_source", ["news_online", "web_google"])
def test_get_keyword_trend_other_sources(media_source):
    q = TrendSearch(
        trend_type="keywords",
        media_source=media_source,
        topic="climate_change",
        start_date=date(2023, 1, 1),
        end_date=date(2023, 1, 31),
    )

    df, limitations = get_keyword_trend(q)

    assert df is not None, f"DataFrame should not be None for {media_source}"
    assert isinstance(
        df, pd.DataFrame
    ), f"Result should be a DataFrame for {media_source}"
    assert not df.empty, f"DataFrame should not be empty for {media_source}"
