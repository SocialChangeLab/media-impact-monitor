from datetime import date, timedelta

import pandas as pd

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.data_loaders.protest.climate_orgs import (
    add_aliases,
    climate_orgs,
)
from media_impact_monitor.events import get_events_by_id
from media_impact_monitor.fulltext_coding import code_fulltext, code_many_fulltexts
from media_impact_monitor.trends.keyword_trend import (
    add_quotes,
    load_keywords,
    xs,
    xs_with_ys,
)
from media_impact_monitor.types_ import FulltextSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.parallel import parallel_tqdm


@cache
def get_fulltexts(q: FulltextSearch) -> pd.DataFrame | None:
    assert (
        q.topic or q.organizers or q.query or q.event_id
    ), "One of 'topic', 'organizers', 'query', or 'event_id' must be provided."
    keywords = load_keywords()
    num_filters = sum(
        [bool(q.topic), bool(q.organizers), bool(q.query), bool(q.event_id)]
    )
    if num_filters > 1:
        raise ValueError(
            "Only one of 'topic', 'organizers', 'query', 'event_id' is allowed."
        )
    if q.topic:
        assert (
            q.topic == "climate_change"
        ), "Only 'climate_change' is supported as topic."
        query = xs(
            keywords["climate_science"]
            + keywords["climate_policy"]
            + keywords["climate_urgency"],
            q.media_source,
        )
    if q.organizers:
        for org in q.organizers:
            assert org in climate_orgs, f"Unknown organization: {org}"
        orgs = add_quotes(add_aliases(q.organizers))
        query = xs_with_ys(orgs, keywords["activism"], q.media_source)
    if q.query:
        query = q.query
    if q.event_id:
        events = get_events_by_id([q.event_id])
        assert len(events) == 1
        event = events.iloc[0]
        # TODO: handle start_date and end_date
        q.start_date = event["date"]
        q.end_date = min(q.end_date or event["date"] + timedelta(days=7), date.today())
        if q.start_date.year < 2022:
            # MediaCloud only goes back until 2022
            return None
        orgs = add_quotes(add_aliases(event["organizers"]))
        if not orgs:
            return None
        query = xs_with_ys(orgs, keywords["activism"], q.media_source)

    assert (
        q.end_date
    ), "end_date must be provided; either explicitly or through the event_id."

    match q.media_source:
        case "news_online":
            df = get_mediacloud_fulltexts(
                query=query,
                start_date=q.start_date,
                end_date=q.end_date,
                countries=["Germany"],
                sample_frac=0.01,
            )
        case _:
            raise ValueError(
                f"The media source '{q.media_source}' does not exist or does not provide fulltexts."
            )

    if df is None:
        return None

    coded = code_many_fulltexts(df["text"])
    for field in ["activism_sentiment", "policy_sentiment"]:
        df[field] = [r[field] if r and field in r else None for r in coded]
        df[field] = df[field].fillna(0).astype(int)

    if q.event_id:
        # TODO filter by only those articles that refer to the event
        pass

    return df
