"""
Documentation of the Google Trends API:
- https://github.com/GeneralMills/pytrends
- https://searchanalysisguide.blogspot.com/2013/04/google-trends-what-is-partial-data.html

There is also regional data, useful for synthetic control.
For the last 90 days, data is also available with daily resolution; otherwise only weekly.
"""

from time import sleep

import pandas as pd
from pytrends.request import TrendReq

from media_impact_monitor.util.cache import cache


@cache
def get_google_trends_counts(query: str) -> pd.DataFrame:
    PyTrends = TrendReq(hl="de-DE", tz=60)
    PyTrends.build_payload([query], timeframe="today 5-y", geo="DE")
    df = PyTrends.interest_over_time()
    df = (
        df[~df["isPartial"]]
        .drop(columns=["isPartial"])
        .rename(columns={query: "count"})
    )
    df.index = pd.to_datetime(df.index).date
    df.index.name = "date"
    # when rate limit is reached, this should be 60 seconds according to https://github.com/GeneralMills/pytrends
    sleep(1)
    return df
