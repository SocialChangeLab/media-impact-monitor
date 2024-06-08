import pandas as pd
import yaml

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_fulltexts,
)
from media_impact_monitor.types_ import Fulltext, FulltextSearch
from media_impact_monitor.util.paths import src


def get_fulltexts(q: FulltextSearch):  # -> pd.DataFrame[Fulltext]
    assert q.countries == ["Germany"], 'Only ["Germany"] is currently supported.'
    assert q.topic == "climate_change", "Only climate_change is currently supported."

    with open(src / "media_impact_monitor/issue_keywords.yaml") as f:
        keywords = yaml.load(f, Loader=yaml.FullLoader)

    query = _build_mediacloud_query(keywords[q.topic])
    print(f"Looking for news fulltexts that match: '{query}'")

    # if q.organizers:
    # TODO: map Literal() list of currently supported organizers to query strings

    # TODO: switch between custom query and topic or organizers based query
    if q.query:
        raise NotImplementedError(
            "Custom queries are not yet supported. Use topic instead."
        )

    match q.media_source:
        case "news_online":
            fulltexts = get_mediacloud_fulltexts(
                query=query,
                start_date=q.start_date,
                end_date=q.end_date,
                countries=q.countries,
            )
        case "news_print":
            raise NotImplementedError(
                "Currently only media_source 'news_online' has fulltexts available"
            )
        case "web_google":
            raise NotImplementedError(
                "Currently only media_source 'news_online' has fulltexts available"
            )
        case _:
            raise ValueError(f"Unsupported media source: {q.media_source}")

    return fulltexts


def _build_mediacloud_query(keywords: list[str]) -> str:
    query = [f'"{a}"' if len(a.split()) > 1 else a for a in keywords]
    query = " OR ".join(query)
    return query
