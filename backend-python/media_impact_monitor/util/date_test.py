from datetime import date, timedelta

import pandas as pd
import pytest
from pydantic import BaseModel

from media_impact_monitor.util.date import get_latest_data


class DataSearch(BaseModel):
    query: str
    end_date: date


def fetch_data_mock(search: DataSearch) -> pd.DataFrame:
    if search.end_date in [date(2024, 4, 3), date(2024, 4, 4)]:
        raise ValueError("Data not available.")
    return pd.DataFrame(
        {
            "date": [search.end_date - timedelta(days=1), search.end_date],
            "value": [41, 42],
        }
    )


def test_fetch_data_mock():
    df = fetch_data_mock(DataSearch(query="test", end_date=date(2024, 4, 2)))
    assert list(df.iloc[-1].values) == [date(2024, 4, 2), 42]
    with pytest.raises(ValueError):
        df = fetch_data_mock(DataSearch(query="test", end_date=date(2024, 4, 4)))


def test_get_latest_data():
    df = get_latest_data(
        fetch_data_mock, DataSearch(query="test", end_date=date(2024, 4, 2))
    )
    assert list(df.iloc[-1].values) == [date(2024, 4, 2), 42]
    df = get_latest_data(
        fetch_data_mock, DataSearch(query="test", end_date=date(2024, 4, 3))
    )
    assert list(df.iloc[-1].values) == [date(2024, 4, 2), 42]
    df = get_latest_data(
        fetch_data_mock, DataSearch(query="test", end_date=date(2024, 4, 4))
    )
    assert list(df.iloc[-1].values) == [date(2024, 4, 2), 42]
    df = get_latest_data(
        fetch_data_mock, DataSearch(query="test", end_date=date(2024, 4, 5))
    )
    assert list(df.iloc[-1].values) == [date(2024, 4, 5), 42]
