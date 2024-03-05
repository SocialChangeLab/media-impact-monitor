import os
from datetime import date
from typing import Literal

import mediacloud.api
import pandas as pd
from dotenv import load_dotenv
from beartype import beartype

from media_impact_monitor.util.cache import cloudcache, get

load_dotenv()

token = os.environ["MEDIACLOUD_API_TOKEN"]
search = mediacloud.api.SearchApi(token)
directory = mediacloud.api.DirectoryApi(token)

start = date(2023, 1, 1)
end = date(2024, 1, 1)

Platform = Literal["onlinenews-mediacloud", "onlinenews-waybackmachine"]


@cloudcache
@beartype
def get_counts(
    query: str,
    start_date: pd.Timestamp = start,
    end_date: pd.Timestamp = end,
    countries: list | None = None,
):
    collection_ids: list[str] = []
    if countries:
        collection_ids = []
        for country in countries:
            results = directory.collection_list(name=f"{country} - national")["results"]
            assert (
                len(results) == 1
            ), f"Expected 1 result, got {len(results)} for {country}"
            collection_ids.append(results[0]["id"])
    data = search.story_count_over_time(
        query=query,
        start_date=start_date.to_pydatetime().date(),
        end_date=end_date.to_pydatetime().date(),
        collection_ids=collection_ids,
        platform="wayback",
    )
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df = df.set_index("date")
    return df
