import pytest

from media_impact_monitor.api import _get_impact
from media_impact_monitor.events import get_events
from media_impact_monitor.impact import get_impact
from media_impact_monitor.types_ import EventSearch, Impact, ImpactSearch, TrendSearch


@pytest.mark.skip(reason="TODO!")  # TODO FIXME!
def test_get_impact():
    events = get_events(EventSearch(source="acled"))
    event_ids = events["event_id"].tolist()[:10]
    impact_search = ImpactSearch(
        cause=event_ids,
        effect=TrendSearch(
            trend_type="keywords",
            media_source="news_online",
            topic="climate_change",
        ),
        method="interrupted_time_series",
    )
    result = get_impact(impact_search)
    assert isinstance(result, Impact)
    assert hasattr(result, "method_applicability")
    assert hasattr(result, "method_applicability_reason")
    assert hasattr(result, "impact_mean")
    assert hasattr(result, "impact_mean_lower")
    assert hasattr(result, "impact_mean_upper")
    assert hasattr(result, "individual_impacts")
    assert isinstance(result.individual_impacts, dict)
    assert isinstance(result.time_series, dict)


def test_xr():
    get_impact(
        ImpactSearch(
            end_date="2024-06-25",
            impacted_trend=TrendSearch(
                end_date="2024-06-25",
                media_source="news_online",
                organizers=["Extinction Rebellion"],
                start_date="2020-01-01",
                topic="climate_change",
                trend_type="sentiment",
            ),
            method="time_series_regression",
            organizer="Extinction Rebellion",
            start_date="2020-01-01",
        )
    )


def test_xr_api():
    response = _get_impact(
        ImpactSearch(
            end_date="2024-06-25",
            impacted_trend=TrendSearch(
                end_date="2024-06-25",
                media_source="news_online",
                organizers=["Extinction Rebellion"],
                start_date="2020-01-01",
                topic="climate_change",
                trend_type="sentiment",
            ),
            method="time_series_regression",
            organizer="Extinction Rebellion",
            start_date="2020-01-01",
        )
    )


@pytest.mark.skip()
def test_fff_api():
    response = _get_impact(
        ImpactSearch(
            end_date="2023-02-19",
            impacted_trend=TrendSearch(
                end_date="2023-02-19",
                media_source="news_online",
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
