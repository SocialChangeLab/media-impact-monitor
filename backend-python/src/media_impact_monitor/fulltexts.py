from datetime import date, timedelta

import pandas as pd

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.data_loaders.protest.climate_orgs import (
    add_aliases,
    climate_orgs,
)
from media_impact_monitor.data_loaders.protest.gaza_orgs import (
    add_gaza_aliases,
    gaza_orgs,
)
from media_impact_monitor.events import get_events_by_id
from media_impact_monitor.fulltext_coding import (
    code_many_fulltexts,
)
from media_impact_monitor.trends.keyword_trend import (
    add_quotes,
    load_keywords,
    xs,
    xs_with_ys,
)
from media_impact_monitor.types_ import FulltextSearch
from media_impact_monitor.util.cache import cache


@cache
def get_fulltexts(q: FulltextSearch, sample_frac: float = 0.1) -> pd.DataFrame | None:
    keywords = load_keywords()
    queries = []
    if q.topic:
        match q.topic:
            case "climate_change":
                query = xs(
                    keywords["climate_science"]
                    + keywords["climate_policy"]
                    + keywords["climate_urgency"],
                    q.media_source,
                )
            case "gaza_crisis":
                query = xs(
                    keywords["gaza_general"]
                    + keywords["gaza_humanitarian"]
                    + keywords["gaza_justice"]
                    + keywords["gaza_political"],
                    q.media_source,
                )
        queries.append(query)
    if q.organizers:
        # Validate organizations based on topic
        if q.topic == "climate_change":
            for org in q.organizers:
                assert org in climate_orgs, f"Unknown climate organization: {org}"
            orgs = add_quotes(add_aliases(q.organizers))
        elif q.topic == "gaza_crisis":
            for org in q.organizers:
                assert org in gaza_orgs, f"Unknown Gaza organization: {org}"
            orgs = add_quotes(add_gaza_aliases(q.organizers))
        else:
            # Default to climate orgs for backward compatibility
            for org in q.organizers:
                assert org in climate_orgs + gaza_orgs, f"Unknown organization: {org}"
            orgs = add_quotes(add_aliases(q.organizers))
        query = xs_with_ys(orgs, keywords["activism"], q.media_source)
        queries.append(query)
    if q.query:
        queries.append(q.query)
    if q.event_id:
        # TODO filter to only those articles that actually refer to the event
        events = get_events_by_id([q.event_id])
        assert len(events) == 1
        event = events.iloc[0]
        # TODO: handle start_date and end_date
        q.start_date = event["date"]
        q.end_date = min(event["date"] + timedelta(days=7), date.today())
        if q.start_date.year < 2022:
            # MediaCloud only goes back until 2022
            return None
        orgs = add_quotes(add_aliases(event["organizers"]))
        if not orgs:
            return None
        query = xs_with_ys(orgs, keywords["activism"], q.media_source)
        queries.append(query)
    assert (
        len(queries) > 0
    ), "At least one of the filters (`topic`, `organizers`, `query` or `event_id`) must be set."
    if len(queries) == 1:
        query = queries[0]
    else:
        # HACK: this only works for mediacloud
        query = " AND ".join(f"({q})" for q in queries)

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
                sample_frac=sample_frac,
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
    df["topics"] = [r["topics"] if r else None for r in coded]

    return df
