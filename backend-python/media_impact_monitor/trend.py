import pandas as pd
import yaml

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_counts,
)
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.web.google_trends import get_google_trends_counts
from media_impact_monitor.types_ import TrendSearch
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.date import verify_dates
from media_impact_monitor.util.paths import src


def get_trend(q: TrendSearch) -> pd.Series:
    assert q.trend_type == "keywords", "Only keywords are supported."
    assert q.topic == "climate_change", "Only climate_change is supported."
    dss = {}
    for topic, query in topic_queries(q.media_source).items():
        match q.media_source:
            case "news_online":
                ds = get_mediacloud_counts(query=query)
            case "news_print":
                ds = get_genios_counts(query=query)
            case "web_google":
                ds = get_google_trends_counts(query=query)
            case _:
                raise ValueError(f"Unsupported media source: {q.media_source}")
        ds.index = pd.to_datetime(ds.index)
        ds = ds.resample("W").sum()
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
    # all_only_activism = f"({all_incl_activism}) AND ({keywords['activism']})"
    keywords = {
        "science": build_query(media_source=media_source, positive=keywords["science"]),
        "policy": build_query(media_source=media_source, positive=keywords["policy"]),
        "urgency": build_query(media_source=media_source, positive=keywords["urgency"]),
        "all_incl_activism": all_incl_activism,
        "all_excl_activism": all_excl_activism,
    }
    print(keywords)
    return keywords


def build_query(
    media_source: str,
    positive: list[str] | None = None,
    negative: list[str] | None = None,
) -> str:
    assert media_source in ["news_online", "news_print", "web_google"]
    assert positive or negative
    match media_source:
        case "news_online":
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
        case "news_print":
            raise NotImplementedError
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
                query = " ".join(q_positive[:3] + q_negative[:3])
            elif positive:
                query = " ".join(q_positive[:5])
            elif negative:
                query = " ".join(q_negative[:5])
            query = query.replace("*", "")
    return query
