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


def topic_keywords():
    with open(src / "media_impact_monitor/trend_keywords.yaml") as f:
        keywords = yaml.load(f, Loader=yaml.FullLoader)
    for k, kws in keywords.items():
        keywords[k] = " OR ".join([f'"{a}"' if len(a.split()) > 1 else a for a in kws])
    all_incl_activism = " OR ".join(
        [keywords[k] for k in ["science", "policy", "urgency"]]
    )
    all_excl_activism = f"({all_incl_activism}) AND NOT ({keywords['activism']})"
    all_only_activism = f"({all_incl_activism}) AND ({keywords['activism']})"
    keywords = {
        **keywords,
        "activism": all_only_activism,
        # "all_incl_activism": all_incl_activism,
        # "all_excl_activism": all_excl_activism,
    }
    return keywords


def get_trend(q: TrendSearch) -> pd.Series:
    assert q.trend_type == "keywords", "Only keywords are supported."
    assert q.topic == "climate_change", "Only climate_change is supported."
    dss = {}
    for topic, query in topic_keywords().items():
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
