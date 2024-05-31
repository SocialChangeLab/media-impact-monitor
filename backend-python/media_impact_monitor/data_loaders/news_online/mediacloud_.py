from datetime import date
from typing import Literal

import mediacloud.api
import pandas as pd
from mcmetadata import extract

from media_impact_monitor.util.cache import cache, get_proxied
from media_impact_monitor.util.env import MEDIACLOUD_API_TOKEN
from media_impact_monitor.util.parallel import parallel_tqdm

search = mediacloud.api.SearchApi(MEDIACLOUD_API_TOKEN)
directory = mediacloud.api.DirectoryApi(MEDIACLOUD_API_TOKEN)
search.TIMEOUT_SECS = 10 * 60

Platform = Literal["onlinenews-mediacloud", "onlinenews-waybackmachine"]

end_date = date.today()


@cache
def get_mediacloud_counts(
    query: str,
    start_date: date = date(2022, 1, 1),
    end_date: date = end_date,
    countries: list | None = None,
    platform: Platform = "onlinenews-mediacloud",
) -> pd.Series:
    """
    Retrieves the MediaCloud counts for a given query and parameters.

    Args:
        query (str): The query string to search for.
        start_date (date, optional): The start date of the time range. Defaults to January 1, 2022.
        end_date (date, optional): The end date of the time range. Defaults to the current date.
        countries (list, optional): A list of country names or ISO codes to filter the results by. Defaults to None.
        platform (Platform, optional): The platform to search on. Defaults to "onlinenews-mediacloud".

    Returns:
        pd.Series: A pandas Series containing the MediaCloud counts for each date in the time range.
    """
    assert start_date.year >= 2022, "MediaCloud currently only goes back to 2022"

    collection_ids = _resolve_countries(countries)
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


def get_mediacloud_fulltexts(
    query: str,
    start_date: date = date(2022, 1, 1),
    end_date: date = end_date,
    countries: list | None = None,
    platform: Platform = "onlinenews-mediacloud",
) -> pd.DataFrame:
    """
    Retrieves fulltexts of news articles from MediaCloud based on the given query and params.

    Args:
        query (str): The search query to retrieve news articles.
        start_date (date, optional): The start date to filter news articles. Defaults to January 1, 2022.
        end_date (date, optional): The end date to filter news articles. Defaults to the current date.
        countries (list, optional): A list of country names to filter news articles. Defaults to None.
        platform (Platform, optional): The platform to search for news articles. Defaults to "onlinenews-mediacloud".

    Returns:
        pd.DataFrame: A DataFrame containing the retrieved news articles with full texts.

    Raises:
        AssertionError: If the start_date is before 2022.
        NotImplementedError: If pagination is needed.
    """
    assert start_date.year >= 2022, "MediaCloud currently only goes back to 2022"
    collection_ids = _resolve_countries(countries)
    data = search.story_list(
        query=query,
        start_date=start_date,
        end_date=end_date,
        collection_ids=collection_ids,
        platform=platform,
    )
    pagination_token = data[1]
    if pagination_token:
        # FIXME
        raise NotImplementedError("Pagination not implemented")

    df = pd.DataFrame(data[0])
    df["publish_date"] = pd.to_datetime(df["publish_date"])
    df["text"] = parallel_tqdm(
        _retrieve_text, df["url"], n_jobs=4, desc="Retrieving fulltexts"
    )
    df = df.dropna(subset=["text"])
    return df


def _retrieve_text(url: str) -> str | None:
    try:
        html = get_proxied(url, timeout=15).text
    except ValueError as e:
        if "RESP002" in str(e):  # zenrows error code for http 404
            return None
        raise e
    data = extract(url=url, html_text=html)
    # this also contains additional metadata (title, language, extraction method, ...) that could be used
    return data["text_content"]


def _resolve_countries(countries: list | None) -> list | None:
    collection_ids: list[int] = []
    collection_ids = []
    for country in countries or []:
        # get national newspapers (regional newspapers are also available)
        results = directory.collection_list(name=f"{country} - national")["results"]
        # ignore research collections
        results = [r for r in results if "(Research Only)" not in r["name"]]
        assert len(results) == 1, f"Expected 1 result, got {len(results)} for {country}"
        collection_ids.append(results[0]["id"])
    return collection_ids
