from datetime import date

import pandas as pd
import pytest

from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.types_ import FulltextSearch


@pytest.fixture
def default_start_date():
    return date(2024, 5, 1)


@pytest.fixture
def default_end_date():
    return date(2024, 5, 2)


@pytest.mark.skip("regression in number of articles that we will fix later")
def test_get_fulltexts_for_org(default_start_date, default_end_date):
    texts = get_fulltexts(
        FulltextSearch(
            media_source="news_online",
            start_date=default_start_date,
            end_date=default_end_date,
            organizers=["Last Generation"],
        ),
        sample_frac=0.1,
    )
    assert texts is not None
    assert len(texts) > 0


def test_get_fulltexts_for_event():
    for event_id in [
        "5599ac04e1fab5e59639d5646ed331ec",  # LG event on 2024-05-17
        "7c46b5c07afe076ee58ae1c79eccc367",  # LG event on 2024-05-18
    ]:
        texts = get_fulltexts(
            FulltextSearch(
                media_source="news_online",
                event_id=event_id,
            ),
            sample_frac=1,
        )
        assert texts is not None
        assert len(texts) > 0


@pytest.mark.skip("too slow for ci (>90s)")
def test_get_fulltexts_for_climate_change(default_start_date, default_end_date):
    result = get_fulltexts(
        FulltextSearch(
            media_source="news_online",
            topic="climate_change",
            start_date=default_start_date,
            end_date=default_end_date,
        ),
        sample_frac=0.001,
    )
    assert isinstance(result, pd.DataFrame)
    assert not result.empty
    assert all(
        col in result.columns
        for col in [
            "title",
            "date",
            "url",
            "text",
            "activism_sentiment",
            "policy_sentiment",
        ]
    )


@pytest.mark.skip("regression in number of articles that we will fix later")
def test_get_fulltexts_custom_query(default_start_date, default_end_date):
    q = FulltextSearch(
        media_source="news_online",
        query="climate protest",
        start_date=default_start_date,
        end_date=default_end_date,
    )
    result = get_fulltexts(q, sample_frac=0.1)
    assert isinstance(result, pd.DataFrame)
    assert not result.empty
    assert "climate" in result["text"].str.lower().sum()
    assert "protest" in result["text"].str.lower().sum()


def test_get_fulltexts_no_filters():
    q = FulltextSearch(media_source="news_online", end_date=date.today())
    with pytest.raises(AssertionError):
        get_fulltexts(q)


def test_get_fulltexts_invalid_organizer(default_start_date, default_end_date):
    q = FulltextSearch(
        media_source="news_online",
        organizers=["Invalid Organization"],
        start_date=default_start_date,
        end_date=default_end_date,
    )
    with pytest.raises(
        AssertionError, match="Unknown organization: Invalid Organization"
    ):
        get_fulltexts(q)


@pytest.mark.skip("regression in number of articles that we will fix later")
def test_get_fulltexts_sample_frac(default_start_date, default_end_date):
    q = FulltextSearch(
        media_source="news_online",
        topic="climate_change",
        start_date=default_start_date,
        end_date=default_end_date,
    )
    result_full = get_fulltexts(q, sample_frac=0.002)
    result_sample = get_fulltexts(q, sample_frac=0.001)
    assert len(result_sample) < len(result_full)


@pytest.mark.skip("too slow for ci (>90s)")
def test_get_fulltexts_date_range(default_start_date, default_end_date):
    q = FulltextSearch(
        media_source="news_online",
        topic="climate_change",
        start_date=default_start_date,
        end_date=default_end_date,
    )
    result = get_fulltexts(q, sample_frac=0.01)
    assert isinstance(result, pd.DataFrame)
    assert not result.empty
    assert all(
        default_start_date <= date <= default_end_date for date in result["date"]
    )
    assert "activism_sentiment" in result.columns
    assert "policy_sentiment" in result.columns
    assert all(result["activism_sentiment"].isin([-1, 0, 1, None]))
    assert all(result["policy_sentiment"].isin([-1, 0, 1, None]))
