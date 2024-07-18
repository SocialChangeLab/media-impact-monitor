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
from media_impact_monitor.trends.keyword_trend import (
    add_quotes,
    load_keywords,
    xs,
    xs_with_ys,
)
from media_impact_monitor.types_ import Fulltext, FulltextSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.parallel import parallel_tqdm
from media_impact_monitor.util.paths import src


@cache
def get_fulltexts(q: FulltextSearch) -> pd.DataFrame | None:
    assert q.topic or q.organizers or q.query or q.event_id
    keywords = load_keywords()
    if q.topic:
        assert q.topic == "climate_change"
        assert not q.query and not q.organizers and not q.event_id
        query = xs(
            keywords["climate_science"]
            + keywords["climate_policy"]
            + keywords["climate_urgency"],
            q.media_source,
        )
    if q.organizers:
        assert not q.topic and not q.query and not q.event_id
        for org in q.organizers:
            assert org in climate_orgs, f"Unknown organization: {org}"
        orgs = add_quotes(add_aliases(q.organizers))
        query = xs_with_ys(orgs, keywords["activism"], q.media_source)
    if q.query:
        assert not q.topic and not q.organizers and not q.event_id
        query = q.query
    if q.event_id:
        assert not q.topic and not q.query and not q.organizers
        events = get_events_by_id([q.event_id])
        assert len(events) == 1
        event = events.iloc[0]
        # TODO: handle start_date and end_date
        q.start_date = event["date"]
        q.end_date = q.end_date or event["date"] + timedelta(days=7)
        if q.start_date.year < 2022:
            # MediaCloud only goes back until 2022
            return None
        orgs = add_quotes(add_aliases(event["organizers"]))
        query = xs_with_ys(orgs, keywords["activism"], q.media_source)

    print(f"Looking for news fulltexts that match: '{query}'")

    match q.media_source:
        case "news_online":
            df = get_mediacloud_fulltexts(
                query=query,
                start_date=q.start_date,
                end_date=q.end_date,
                countries=["Germany"],
            )
        case _:
            raise ValueError(
                f"The media source '{q.media_source}' does not exist or does not provide fulltexts."
            )

    if df is None:
        return None

    # TODO: use asyncio
    responses = parallel_tqdm(code_fulltext, df["text"], desc="Processing fulltexts")
    df["sentiment"] = [
        r["sentiment"] if r and "sentiment" in r else None for r in responses
    ]
    df["sentiment"] = df["sentiment"].fillna(0).astype(int)

    if q.event_id:
        # TODO filter by only those articles that refer to the event
        pass

    return df
