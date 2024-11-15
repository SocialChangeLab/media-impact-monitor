import pandas as pd
import yaml

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_counts,
)
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.social_media.tiktok import (
    get_video_history_for_hashtag,
)
from media_impact_monitor.data_loaders.web.google_trends import get_google_trends_counts
from media_impact_monitor.types_ import TrendSearch
from media_impact_monitor.util.paths import src


def get_keyword_trend(q: TrendSearch) -> tuple[pd.DataFrame | None, list[str]]:
    assert q.trend_type == "keywords"
    assert q.topic == "climate_change", "Only climate_change is supported."
    dss = {}
    limitations = set()
    for topic, query in topic_queries(q.media_source).items():
        match q.media_source:
            case "news_online":
                ds, lims = get_mediacloud_counts(
                    query=query,
                    countries=["Finland"],
                    start_date=q.start_date,
                    end_date=q.end_date,
                )
                limitations.update(lims)
            case "news_print":
                ds = get_genios_counts(
                    query=query, start_date=q.start_date, end_date=q.end_date
                )
            case "web_google":
                ds = get_google_trends_counts(query=query, end_date=q.end_date)
            case "social_tiktok":
                ds = get_video_history_for_hashtag(query, n=1000, verbose=True)["posts"]
            case _:
                raise ValueError(f"Unsupported media source: {q.media_source}")
        dss[topic] = ds
    df = pd.DataFrame({k: v for k, v in dss.items() if v is not None})
    df = None if df.empty else df
    return df, list(limitations)


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
        "climate policy": xs(keywords["climate_policy"], media_source),
        "climate science": xs(keywords["climate_science"], media_source),
        "climate crisis framing": xs(keywords["climate_urgency"], media_source),
        # "all_excl_activism": xs_without_ys(
        #     keywords["climate_science"]
        #     + keywords["climate_policy"]
        #     + keywords["climate_urgency"],
        #     keywords["activism"],
        #     media_source,
        # ),
    }
    if media_source == "social_tiktok":
        keyword_queries = {
            "climate activism": "climateprotest",  # TODO: improve
            "climate policy": "climateaction",  # TODO: improve
            "climate science": "climatechange",  # TODO: improve
            "climate crisis framing": "climatecrisis",  # TODO: improve
        }
    elif media_source != "web_google":
        keyword_queries["climate activism"] = xs_with_ys(
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
            # max query length is 100 characters (?)
            # HACK
            while sum(len(x) for x in xs) + 2 * len(xs) > 100:
                xs.pop()
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
            # max query length is 100 characters
            # HACK
            while sum(len(x) for x in xs) + 2 * len(xs) > 50:
                xs.pop()
            while sum(len(y) for y in ys) + 2 * len(ys) > 50:
                ys.pop()
            return (
                f"{' '.join([f'+{x}' for x in xs])} {' '.join([f'-{y}' for y in ys])}"
            )
