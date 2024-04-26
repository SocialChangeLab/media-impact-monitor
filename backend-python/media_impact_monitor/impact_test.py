from datetime import date

import pandas as pd

from media_impact_monitor.events import get_events
from media_impact_monitor.impact import get_impact
from media_impact_monitor.types_ import Effect, EventSearch, Impact, ImpactSearch


def test_get_impact():
    events = get_events(
        EventSearch(
            event_type="protest",
            source="acled",
            start_date=date(2023, 8, 1),
            end_date=date(2023, 10, 31),
            organizers=["Last Generation (Germany)"],
        )
    )
    event_ids = events["event_id"].tolist()
    impact_search = ImpactSearch(
        cause=event_ids,
        effect=Effect(
            trend_type="keywords",
            media_source="news_online",
            query="climate change",
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
    assert isinstance(result.impact_mean, dict)
