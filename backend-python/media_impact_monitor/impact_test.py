import pytest

from media_impact_monitor.api import _get_impact
from media_impact_monitor.impact import get_impact
from media_impact_monitor.types_ import ImpactSearch, TrendSearch


def test_xr():
    get_impact(
        ImpactSearch(
            end_date="2024-06-25",
            impacted_trend=TrendSearch(
                end_date="2024-06-25",
                media_source="news_print",  # news_online is too slow to retrieve during testing
                organizers=["Extinction Rebellion"],
                start_date="2020-01-01",
                topic="climate_change",
                trend_type="keywords",  # sentiment is too expensive to retrieve during testing
            ),
            method="time_series_regression",
            organizer="Extinction Rebellion",
            start_date="2020-01-01",
        )
    )


def test_xr_api():
    _get_impact(
        ImpactSearch(
            end_date="2024-06-25",
            impacted_trend=TrendSearch(
                end_date="2024-06-25",
                media_source="news_print",
                organizers=["Extinction Rebellion"],
                start_date="2020-01-01",
                topic="climate_change",
                trend_type="keywords",
            ),
            method="time_series_regression",
            organizer="Extinction Rebellion",
            start_date="2020-01-01",
        )
    )


@pytest.mark.skip()
def test_fff_api():
    _get_impact(
        ImpactSearch(
            end_date="2023-02-19",
            impacted_trend=TrendSearch(
                end_date="2023-02-19",
                media_source="news_print",
                organizers=["Fridays for Future"],
                start_date="2022-09-14",
                topic="climate_change",
                trend_type="sentiment",  # sentiment is only available from 2024
            ),
            method="time_series_regression",
            organizer="Fridays for Future",
            start_date="2022-09-14",
        )
    )
