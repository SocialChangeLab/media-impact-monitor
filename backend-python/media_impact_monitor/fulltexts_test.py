from datetime import date

import pytest

from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.types_ import FulltextSearch


def test_get_fulltexts_for_org():
    texts = get_fulltexts(
        FulltextSearch(
            media_source="news_online",
            start_date=date(2024, 5, 1),
            end_date=date(2024, 5, 2),
            organizers=["Last Generation"],
        ),
        sample_frac=0.1,
    )
    assert texts is not None
    assert len(texts) > 0


def test_get_fulltexts_for_event():
    for event_id in [
        "5599ac04e1fab5e59639d5646ed331ec",  # LG event on 2024-05-17
        "7c46b5c07afe076ee58ae1c79eccc367",  # LG event on 2024-05-18
    ]:
        texts = get_fulltexts(
            FulltextSearch(
                media_source="news_online",
                event_id=event_id,
                end_date=date(2024, 5, 18),  # end_date is ignored
            ),
            sample_frac=0.1,
        )
        assert texts is not None
        assert len(texts) > 0


def test_get_fulltexts_for_climate_change():
    texts = get_fulltexts(
        FulltextSearch(
            media_source="news_online",
            topic="climate_change",
            # using a Sunday so there's fewer articles
            start_date=date(2022, 3, 6),
            end_date=date(2022, 3, 6),
        )
    )
    assert texts is not None
    assert len(texts) > 0
    # TODO: check availability and format of dates
