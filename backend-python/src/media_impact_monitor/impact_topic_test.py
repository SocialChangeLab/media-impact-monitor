"""Restored ACLED analysis must use the selected topic and handle empty data."""

from unittest.mock import Mock

import pytest

from media_impact_monitor import impact
from media_impact_monitor.types_ import ImpactSearch, TrendSearch


@pytest.mark.parametrize(
    "topic, expected",
    [
        ("gaza_crisis", "gaza_crisis"),
        ("climate_change", "climate_change"),
        (None, "climate_change"),
    ],
)
def test_impact_selects_topic_before_testing_applicability(
    monkeypatch, topic, expected
):
    fetch = Mock(return_value=None)
    monkeypatch.setattr(impact, "get_events", fetch)
    result = impact.get_impact.func(
        ImpactSearch(
            organizer="Synthetic group",
            impacted_trend=TrendSearch(
                trend_type="keywords", media_source="news_online", topic=topic
            ),
        )
    )
    assert fetch.call_args.args[0].topic == expected
    assert not result.method_applicability
    assert result.impact_estimates is None
