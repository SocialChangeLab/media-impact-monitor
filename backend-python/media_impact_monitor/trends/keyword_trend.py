from datetime import date

import pandas as pd
import yaml

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_counts,
)
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.web.google_trends import get_google_trends_counts
from media_impact_monitor.types_ import TrendSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.paths import src


def get_keyword_trend(q: TrendSearch) -> pd.DataFrame:
    assert q.trend_type == "keywords"
    assert q.topic == "climate_change", "Only climate_change is supported."
    dss = {}
    for topic, query in topic_queries(q.media_source).items():
        match q.media_source:
            case "news_online":
                ds = get_mediacloud_counts(
                    query=query, countries=["Germany"], end_date=q.end_date
                )
            case "news_print":
                ds = get_genios_counts(query=query, end_date=q.end_date)
            case "web_google":
                ds = get_google_trends_counts(query=query, end_date=q.end_date)
            case _:
                raise ValueError(f"Unsupported media source: {q.media_source}")
        ds.index = pd.to_datetime(ds.index)
        if q.aggregation == "weekly":
            ds = ds.resample("W").sum()
        elif q.aggregation == "monthly":
            ds = ds.resample("M").sum()
        ds.index = ds.index.date
        ds.index.name = "date"
        dss[topic] = ds
    df = pd.DataFrame(dss)
    return df


def topic_queries(media_source: str) -> dict[str, str]:
    with open(src / "media_impact_monitor/trend_keywords.yaml") as f:
        keywords = yaml.load(f, Loader=yaml.FullLoader)
    all_incl_activism = build_query(
        media_source=media_source,
        positive=keywords["science"] + keywords["policy"] + keywords["urgency"],
    )
    all_excl_activism = build_query(
        media_source=media_source,
        positive=keywords["science"] + keywords["policy"] + keywords["urgency"],
        negative=keywords["activism"],
    )
    keywords = {
        "science": build_query(media_source=media_source, positive=keywords["science"]),
        "policy": build_query(media_source=media_source, positive=keywords["policy"]),
        "urgency": build_query(media_source=media_source, positive=keywords["urgency"]),
        # "all_incl_activism": all_incl_activism,
        # "all_excl_activism": all_excl_activism,
    }
    if media_source == "mediacloud":
        keywords["activism"] = (
            f"({all_incl_activism}) AND ({build_query(media_source=media_source, positive=keywords['activism'])})"
        )
    return keywords


def build_query(
    media_source: str,
    positive: list[str] | None = None,
    negative: list[str] | None = None,
) -> str:
    """
    Build a boolean query, which works differently for different data sources.
    This does not support general boolean queries, but only like:
    - A or B or ... or G
    - not (A or B or ... or G)
    - (A or B or ... or G) and not (Q or V or ... or Z)
    """
    assert media_source in ["news_online", "news_print", "web_google"]
    assert positive or negative
    match media_source:
        case "news_online" | "news_print":
            # for print news see: https://www.gbi-genios.de/de/hilfe/genios/verknuepfung-von-suchworten
            if positive:
                q_positive = [f'"{a}"' if len(a.split()) > 1 else a for a in positive]
                q_positive = " OR ".join(q_positive)
            if negative:
                q_negative = [f'"{a}"' if len(a.split()) > 1 else a for a in negative]
                q_negative = " OR ".join(q_negative)
            if positive and negative:
                query = f"({q_positive}) AND NOT ({q_negative})"
            elif positive:
                query = q_positive
            elif negative:
                query = f"NOT ({q_negative})"
        case "web_google":
            # see https://newsinitiative.withgoogle.com/resources/trainings/advanced-google-trends/
            # and https://support.google.com/trends/answer/4359582?hl=en
            q_positive = (
                [f'+"{a}"' if len(a.split()) > 1 else f"+{a}" for a in positive]
                if positive
                else []
            )
            q_negative = (
                [f'-"{a}"' if len(a.split()) > 1 else f"-{a}" for a in negative]
                if negative
                else []
            )
            if positive and negative:
                query = " ".join(q_positive[:4] + q_negative[:4])
            elif positive:
                query = " ".join(q_positive[:4])
            elif negative:
                query = " ".join(q_negative[:4])
            query = query.replace("*", "")
    return query
