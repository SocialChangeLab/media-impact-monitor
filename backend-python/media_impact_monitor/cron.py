"""
Cron job to be run every day to populate the cache.
"""

import logging
from functools import partial

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from media_impact_monitor.events import get_events
from media_impact_monitor.impact import get_impact
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    CountTimeSeries,
    EventSearch,
    Impact,
    ImpactSearch,
    TrendSearch,
)


def setup_cron():
    # register cron job that regularly fills the cache
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=partial(fill_cache),
        trigger=CronTrigger(hour=3, minute=15, second=0, timezone="UTC"),
    )
    scheduler.start()


def fill_cache():
    logging.info("Filling cache...")
    for data_source in ["acled", "press_releases"]:
        try:
            get_events(EventSearch(source=data_source, topic="climate_change"))
        except Exception as e:
            logging.error(f"Error fetching events: {e}")
    for trend_type in ["keywords", "sentiment"]:
        for media_source in ["news_online", "news_print", "web_google"]:
            for aggregation in ["daily", "weekly"]:
                try:
                    get_trend(
                        TrendSearch(
                            trend_type=trend_type,
                            media_source=media_source,
                            topic="climate_change",
                            aggregation=aggregation,
                        )
                    )
                except Exception as e:
                    logging.error(f"Error fetching trend: {e}")
    # TODO: compute impacts
    logging.info("Successfully filled cache!")
    return
