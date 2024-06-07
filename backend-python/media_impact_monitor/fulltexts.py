from datetime import timedelta

import pandas as pd
import yaml

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.data_loaders.protest.climate_orgs import (
    add_aliases,
    climate_orgs,
)
from media_impact_monitor.events import get_events_by_id
from media_impact_monitor.fulltext_coding import code_fulltext
from media_impact_monitor.types_ import Fulltext, FulltextSearch
from media_impact_monitor.util.parallel import parallel_tqdm
from media_impact_monitor.util.paths import src


def get_fulltexts(q: FulltextSearch):  # -> pd.DataFrame[Fulltext]
    assert q.countries == ["Germany"], 'Only ["Germany"] is currently supported.'
    assert q.topic or q.query or q.event_id

    if q.topic:
        assert q.topic == "climate_change"
        assert not q.query and not q.organizers and not q.event_id
        query = _get_query(q.topic)
    if q.organizers:
        assert not q.topic and not q.query and not q.event_id
        for org in q.organizers:
            assert org in climate_orgs, f"Unknown organization: {org}"
        query = _build_mediacloud_query(add_aliases(q.organizers))
    if q.query:
        assert not q.topic and not q.organizers and not q.event_id
        query = q.query
    if q.event_id:
        assert not q.topic and not q.query and not q.organizers
        events = get_events_by_id([q.event_id])
        assert len(events) == 1
        event = events.iloc[0]
        # TODO: handle start_date and end_date
        q.start_date = event["date"] - timedelta(days=7)
        q.end_date = event["date"] + timedelta(days=7)
        query = _build_mediacloud_query(add_aliases(event["organizers"]))

    print(f"Looking for news fulltexts that match: '{query}'")

    match q.media_source:
        case "news_online":
            df = get_mediacloud_fulltexts(
                query=query,
                start_date=q.start_date,
                end_date=q.end_date,
                countries=q.countries,
            )
        case _:
            raise ValueError(
                f"The media source '{q.media_source}' does not exist or does not provide fulltexts."
            )

    responses = parallel_tqdm(code_fulltext, df["text"], desc="Processing fulltexts")
    df = pd.concat([df, pd.DataFrame(responses)], axis=1)

    if q.event_id:
        # TODO filter by only those articles that refer to the event
        pass

    return df


def _build_mediacloud_query(keywords: list[str]) -> str:
    query = [f'"{a}"' if len(a.split()) > 1 else a for a in keywords]
    query = " OR ".join(query)
    return query


def _get_query(topic: str):
    with open(src / "media_impact_monitor/issue_keywords.yaml") as f:
        keywords = yaml.load(f, Loader=yaml.FullLoader)
    return _build_mediacloud_query(keywords[topic])
