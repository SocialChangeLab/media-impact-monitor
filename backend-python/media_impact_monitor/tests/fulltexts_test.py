from datetime import date, timedelta

import pytest

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.types_ import Fulltext, FulltextSearch


@pytest.mark.skip(reason="TODO!")  # TODO FIXME!
def test_get_fulltexts():
    texts = get_fulltexts(
        FulltextSearch(
            media_source="news_online",
            start_date=date.today(),  # today -> limits to only a few for quick testing
            # end_date=date.today(),
            # start_date=date.today() - timedelta(days=1), # yesterday
            topic="climate_change",
        )
    )

    assert texts is not None
    # assert class Fulltext


# def test_get_mediacloud_fulltexts():
#     start_date = date(2024, 5, 20)
#     query = '"letzte generation"'
#     fulltexts = get_mediacloud_fulltexts(
#         query=query, start_date=start_date, countries=["Germany"]
#     )
