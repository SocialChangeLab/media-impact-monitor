import os
from datetime import date
from typing import Literal

import mediacloud.api
import pandas as pd
from dotenv import load_dotenv

from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.env import MEDIACLOUD_API_TOKEN

load_dotenv()


search = mediacloud.api.SearchApi(MEDIACLOUD_API_TOKEN)
directory = mediacloud.api.DirectoryApi(MEDIACLOUD_API_TOKEN)


Platform = Literal["onlinenews-mediacloud", "onlinenews-waybackmachine"]

end_date = date.today()


@cache
def get_mediacloud_counts(
    query: str,
    start_date: date = date(2023, 1, 1),
    end_date: date = end_date,
    countries: list | None = None,
    platform: Platform = "onlinenews-mediacloud",
) -> pd.Series:
    assert start_date.year >= 2023, "MediaCloud currently only goes back to 2023"
    collection_ids: list[int] = []
    if countries:
        collection_ids = []
        for country in countries:
            # get national newspapers (regional newspapers are also available)
            results = directory.collection_list(name=f"{country} - national")["results"]
            # ignore research collections
            results = [r for r in results if "(Research Only)" not in r["name"]]
            assert (
                len(results) == 1
            ), f"Expected 1 result, got {len(results)} for {country}"
            collection_ids.append(results[0]["id"])
    data = search.story_count_over_time(
        query=query,
        start_date=start_date,
        end_date=end_date,
        collection_ids=collection_ids,
        platform=platform,
    )
    df = pd.DataFrame(data)
    df = df[["date", "count"]]  # ignore total_count and ratio
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df = df.set_index("date")
    return df["count"]
