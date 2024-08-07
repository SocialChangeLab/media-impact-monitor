"""
Cron job to be run every day to populate the cache.
"""

from datetime import date, timedelta
from functools import partial

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sentry_sdk.crons import monitor
from tqdm import tqdm

from media_impact_monitor.events import get_events
from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.impact import get_impact
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    EventSearch,
    FulltextSearch,
    Impact,
    ImpactSearch,
    TrendSearch,
)


def setup_cron():
    # register cron job that regularly fills the cache
    # Berlin is UTC + 2, thus UTC 01.00 = Berlin 03.00
    scheduler = BackgroundScheduler()
    # run multiple times, because MediaCloud might not work on first try
    for delay in [0, 15, 30, 45]:
        scheduler.add_job(
            func=partial(fill_cache),
            trigger=CronTrigger(hour=1, minute=delay, second=0, timezone="UTC"),
        )
    scheduler.start()


@monitor(monitor_slug="data-processing-cron-job")
def fill_cache():
    print("Filling cache...")
    errors = []
    events = {}
    for data_source in ["acled", "press_releases"]:
        print(f"Retrieving {data_source} events...")
        try:
            events[data_source] = get_events(
                EventSearch(
                    source=data_source, topic="climate_change", end_date=date.today()
                )
            )
        except Exception as e:
            errors.append(f"events {data_source}: {e}")
    for media_source in ["news_online", "news_print", "web_google"]:
        for trend_type in ["keywords"]:  # , "sentiment"]:
            for aggregation in ["daily", "weekly"]:
                if aggregation == "daily" and media_source == "web_google":
                    continue
                if trend_type == "sentiment" and media_source != "news_online":
                    continue
                print(f"Retrieving {media_source} {trend_type} {aggregation} trend...")
                try:
                    get_trend(
                        TrendSearch(
                            trend_type=trend_type,
                            media_source=media_source,
                            topic="climate_change",
                            aggregation=aggregation,
                            end_date=date.today(),
                        )
                    )
                except Exception as e:
                    errors.append(
                        f"trend {media_source} {trend_type} {aggregation}: {e}"
                    )
    events = events["acled"]  # TODO: include press_releases
    recent_events = events[events["date"] >= date.today() - timedelta(days=70)]
    # for event in tqdm(
    #     list(recent_events.itertuples()),
    #     desc="Retrieving event fulltexts",
    # ):
    #     try:
    #         get_fulltexts(
    #             FulltextSearch(
    #                 media_source="news_online",
    #                 event_id=event.event_id,
    #             )
    #         )
    #     except Exception as e:
    #         errors.append(f"fulltexts {event.event_id}: {e}")
    if errors:
        raise ValueError(f"Errors occurred: {'; '.join(errors)}")
    print("Successfully filled cache!")
    return
