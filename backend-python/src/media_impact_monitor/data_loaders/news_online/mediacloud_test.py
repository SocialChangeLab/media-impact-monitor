from datetime import date, timedelta
from unittest.mock import Mock, call

import pandas as pd
import pytest
from freezegun import freeze_time

from media_impact_monitor.data_loaders.news_online import mediacloud_
from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    _slice_date_range,
    get_mediacloud_counts,
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
    expected = [(date(2023, 3, 1), date(2023, 3, 31))]
    assert _slice_date_range(start, end) == expected


def _assert_daily_counts(counts: pd.Series, start: date, end: date) -> None:
    assert isinstance(counts, pd.Series), "MediaCloud did not return a count series."
    expected_dates = pd.Index(pd.date_range(start, end).date, name="date")
    # Full coverage also catches missing, duplicate, unordered, and out-of-range days.
    pd.testing.assert_index_equal(counts.index, expected_dates)
    assert counts.notna().all(), "The returned series contains missing counts."
    assert (counts >= 0).all(), "The returned series contains negative counts."
    assert (counts % 1 == 0).all(), "The returned series contains fractional counts."


def test_get_counts_mediacloud():
    """Live API check: credentials and provider failures must still fail CI."""
    start, end = date(2023, 7, 1), date(2023, 12, 31)
    counts, limitations = get_mediacloud_counts(
        query='"Fridays for Future"',
        start_date=start,
        end_date=end,
        countries=["Germany", "United Kingdom"],
    )
    # The provider's historical corpus changes. Daily jumps, monthly caps, and
    # September-versus-August volume are not guarantees of this application's API.
    _assert_daily_counts(counts, start, end)
    assert counts.sum() > 0, "The historical query unexpectedly returned no articles."
    assert limitations == []


@pytest.mark.parametrize("countries", [None, ["Germany", "United Kingdom"]])
def test_get_counts_preserves_every_provider_count(monkeypatch, countries):
    start, end = date(2023, 7, 1), date(2023, 7, 3)
    rows = [
        {"date": start, "count": 0},
        {"date": start + timedelta(days=1), "count": 750},
        {"date": end, "count": 12},
    ]
    resolve = Mock(side_effect=[[10, 11], [20, 21]])
    fetch = Mock(return_value=rows)
    monkeypatch.setattr(mediacloud_, "_resolve_country", resolve)
    monkeypatch.setattr(mediacloud_, "_story_count_over_time", fetch)

    counts, limitations = get_mediacloud_counts(
        query='"Fridays for Future"',
        start_date=start,
        end_date=end,
        countries=countries,
        platform="onlinenews-waybackmachine",
    )

    fetch.assert_called_once_with(
        query='"Fridays for Future"',
        start_date=start,
        end_date=end,
        collection_ids=[10, 11, 20, 21] if countries else None,
        platform="onlinenews-waybackmachine",
    )
    assert resolve.call_args_list == (
        [call("Germany"), call("United Kingdom")] if countries else []
    )
    expected = pd.Series(
        [row["count"] for row in rows],
        index=pd.Index([row["date"] for row in rows], name="date"),
        name="count",
    )
    pd.testing.assert_series_equal(counts, expected)
    assert counts.sum() == sum(row["count"] for row in rows)
    _assert_daily_counts(counts, start, end)
    assert limitations == []


def test_get_counts_missing_provider_response(monkeypatch):
    monkeypatch.setattr(mediacloud_, "_story_count_over_time", Mock(return_value=None))
    counts, limitations = get_mediacloud_counts(
        query="climate", start_date=date(2023, 7, 1), end_date=date(2023, 7, 3)
    )
    assert counts is None
    assert limitations == []


@pytest.mark.parametrize(
    ("offsets", "values"),
    [
        ([0, 1, 2], [1, -1, 3]),
        ([0, 1, 2], [1, float("nan"), 3]),
        ([0, 1, 2], [1, 1.5, 3]),
        ([0, 2], [1, 3]),
        ([0, 0, 2], [1, 2, 3]),
        ([-1, 1, 2], [1, 2, 3]),
        ([1, 0, 2], [1, 2, 3]),
        ([], []),
    ],
    ids=[
        "negative",
        "missing-count",
        "fractional",
        "missing-day",
        "duplicate-day",
        "out-of-range",
        "unordered",
        "empty",
    ],
)
def test_daily_counts_contract_rejects_invalid_data(offsets, values):
    start, end = date(2023, 7, 1), date(2023, 7, 3)
    counts = pd.Series(
        values,
        index=pd.Index(
            [start + timedelta(days=offset) for offset in offsets], name="date"
        ),
        name="count",
        dtype=float,
    )
    with pytest.raises(AssertionError):
        _assert_daily_counts(counts, start, end)
