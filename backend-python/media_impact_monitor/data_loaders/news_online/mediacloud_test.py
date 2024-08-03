from datetime import date

import pandas as pd
import pytest
from freezegun import freeze_time

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_counts,
    _slice_date_range,
)


@freeze_time("2023-06-15")
def test_slicing_normal_case():
    start = date(2023, 4, 15)
    end = date(2023, 6, 20)
    expected = [
        (date(2023, 4, 1), date(2023, 4, 30)),
        (date(2023, 5, 1), date(2023, 5, 31)),
        (date(2023, 6, 1), date(2023, 6, 15)),  # Note: last day is today
    ]
    assert _slice_date_range(start, end) == expected


@freeze_time("2023-06-15")
def test_slicing_future_end_date():
    start = date(2023, 5, 1)
    end = date(2023, 7, 15)
    expected = [
        (date(2023, 5, 1), date(2023, 5, 31)),
        (date(2023, 6, 1), date(2023, 6, 15)),  # Note: last day is today
    ]
    assert _slice_date_range(start, end) == expected


def test_slicing_same_month():
    start = date(2023, 3, 10)
    end = date(2023, 3, 20)
    expected = [(date(2023, 3, 1), date(2023, 3, 20))]
    assert _slice_date_range(start, end) == expected


@pytest.mark.skip("Currently unavailable")
def test_get_counts_mediacloud():
    df = get_mediacloud_counts(
        query='"Fridays for Future"',
        start_date=date(2023, 6, 1),
        end_date=date(2023, 12, 1),
        countries=["Germany", "United Kingdom"],
    )
    assert not df.empty, "The dataframe returned is unexpectedly empty."
    assert (
        df.index >= date(2023, 6, 1)
    ).all(), "The returned dataframe contains dates before the start date."
    assert (
        df.index <= date(2023, 7, 1)
    ).all(), "The returned dataframe contains dates after the end date."
    assert (df["count"] >= 0).all(), "The returned dataframe contains negative counts."
    print(df["count"].diff().abs())
    assert (
        df["count"].diff().abs().fillna(0) <= 200
    ).all(), "The returned dataframe contains a count change of more than 200."
    # assume more counts in September (due to global climate strike) than in August
    df.index = pd.to_datetime(df.index)
    assert (
        df.resample("ME").sum()["count"]["2023-09"].item()
        > df.resample("ME").sum()["count"]["2023-08"].item()
    ), "The count in September is not higher than in August."
    assert (
        df.resample("ME").sum()["count"] < 10_000
    ).all(), "The count per month is higher than 10,000 for some months."
    assert (
        df.resample("ME").sum()["count"] > 10
    ).all(), "The count per month is lower than 30 for some months."
