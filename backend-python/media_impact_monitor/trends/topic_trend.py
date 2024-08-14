from datetime import date
import pandas as pd

from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.types_ import FulltextSearch, TrendSearch
from media_impact_monitor.util.cache import cache


@cache
def get_topic_trend(q: TrendSearch) -> pd.DataFrame | str:
    if q.media_source != "news_online":
        return f"Topic trend requires fulltext analysis, which is only available for news_online, not {q.media_source}."
    q.start_date = q.start_date or date(2022, 1, 1)
    params = dict(q)
    del params["trend_type"]
    del params["aggregation"]
    df = get_fulltexts(FulltextSearch(**params), sample_frac=0.01)
    df = pd.concat([df["date"], df["topics"].apply(pd.Series)], axis=1)
    # TODO: normalize!!
    df = df.groupby("date").sum()
    # add 0 for missing dates between q.start_date and q.end_date
    df = df.reindex(pd.date_range(q.start_date, q.end_date, freq="D"), fill_value=0)
    return df
