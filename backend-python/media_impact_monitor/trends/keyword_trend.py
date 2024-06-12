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


def add_quotes(xs: list[str]) -> list[str]:
    return [f'"{x}"' if " " in x else x for x in xs]


def load_keywords():
    with open(src / "media_impact_monitor/issue_keywords.yaml") as f:
        keywords = yaml.load(f, Loader=yaml.FullLoader)
    for k, v in keywords.items():
        keywords[k] = add_quotes(v)
    return keywords


def topic_queries(media_source: str) -> dict[str, str]:
    keywords = load_keywords()
    keyword_queries = {
        "science": xs(keywords["climate_science"], media_source),
        "policy": xs(keywords["climate_policy"], media_source),
        "urgency": xs(keywords["climate_urgency"], media_source),
        "all_excl_activism": xs_without_ys(
            keywords["climate_science"]
            + keywords["climate_policy"]
            + keywords["climate_urgency"],
            keywords["activism"],
            media_source,
        ),
    }
    if media_source != "web_google":
        keyword_queries["activism"] = xs_with_ys(
            keywords["climate_science"]
            + keywords["climate_policy"]
            + keywords["climate_urgency"],
            keywords["activism"],
            media_source,
        )
    return keyword_queries


def xs(xs: list[str], media_source: str) -> str:
    # x1 OR x2 OR ... OR xN
    match media_source:
        case "news_online" | "news_print":
            return " OR ".join(xs)
        case "web_google":
            return " ".join([f"+{x}" for x in xs])


def xs_with_ys(xs: list[str], ys: list[str], media_source: str) -> str:
    # (x1 OR x2 OR ... OR xN) AND (y1 OR y2 OR ... OR yN)
    match media_source:
        case "news_online" | "news_print":
            return f"({' OR '.join(xs)}) AND ({' OR '.join(ys)})"
        case "web_google":
            # could be worked around by doing multiple queries
            raise ValueError("Not supported for web_google")


def xs_without_ys(xs: list[str], ys: list[str], media_source: str) -> str:
    # (x1 OR x2 OR ... OR xN) AND NOT (y1 OR y2 OR ... OR yN)
    match media_source:
        case "news_online" | "news_print":
            return f"({' OR '.join(xs)}) AND NOT ({' OR '.join(ys)})"
        case "web_google":
            return (
                f"{' '.join([f'+{x}' for x in xs])} {' '.join([f'-{y}' for y in ys])}"
            )
