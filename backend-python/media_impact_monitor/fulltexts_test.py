from datetime import date, timedelta

import pytest

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.types_ import Fulltext, FulltextSearch


def test_get_fulltexts_for_org():
    texts = get_fulltexts(
        FulltextSearch(
            media_source="news_online",
            start_date=date(2024, 5, 1),
            end_date=date(2024, 5, 2),
            organizers=["Last Generation (Germany)"],
        )
    )
    assert texts is not None
    assert len(texts) > 0


def test_get_fulltexts_for_event():
    for event_id in [
        "f25981c7511ef5fcf091e43c8ccd1fe6",
        "d77d63eab7282efe7f7ce0e57b43c9ff",
    ]:
        texts = get_fulltexts(
            FulltextSearch(
                media_source="news_online",
                event_id=event_id,
                end_date=date(2024, 5, 18),
            )
        )
        assert texts is not None
        assert len(texts) > 0
        assert (texts["date"] <= date(2024, 5, 18)).all()


# def test_get_mediacloud_fulltexts():
#     start_date = date(2024, 5, 20)
#     query = '"letzte generation"'
#     fulltexts = get_mediacloud_fulltexts(
#         query=query, start_date=start_date, countries=["Germany"]
#     )
