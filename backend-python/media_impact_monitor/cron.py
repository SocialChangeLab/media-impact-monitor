"""
Cron job to be run every day to populate the cache.
"""

from datetime import date
from functools import partial

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sentry_sdk.crons import monitor

from media_impact_monitor.events import get_events
from media_impact_monitor.impact import get_impact
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    EventSearch,
    Impact,
    ImpactSearch,
    TrendSearch,
)


def setup_cron():
    # register cron job that regularly fills the cache
    # Berlin is UTC + 2, thus UTC 01.00 = Berlin 03.00
    scheduler = BackgroundScheduler()
    # run multiple times, because MediaCloud might not work on first try
    for delay in [0, 15, 45, 60]:
        scheduler.add_job(
            func=partial(fill_cache),
            trigger=CronTrigger(hour=1, minute=delay, second=0, timezone="UTC"),
        )
    scheduler.start()


@monitor(monitor_slug="data-processing-cron-job")
def fill_cache():
    print("Filling cache...")
    for data_source in ["acled", "press_releases"]:
        get_events(
            EventSearch(
                source=data_source, topic="climate_change", end_date=date.today()
            )
        )
    for trend_type in ["keywords", "sentiment"]:
        for media_source in ["news_online", "news_print", "web_google"]:
            for aggregation in ["daily", "weekly"]:
                if aggregation == "daily" and media_source == "web_google":
                    continue
                if trend_type == "sentiment" and media_source != "news_online":
                    continue
                get_trend(
                    TrendSearch(
                        trend_type=trend_type,
                        media_source=media_source,
                        topic="climate_change",
                        aggregation=aggregation,
                        end_date=date.today(),
                    )
                )
    # TODO: compute impacts
    print("Successfully filled cache!")
    return
