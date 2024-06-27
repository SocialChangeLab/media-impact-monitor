import base64
from datetime import date
from typing import Literal

import mediacloud.api
import pandas as pd
from mcmetadata import extract
from mcmetadata.exceptions import BadContentError

from media_impact_monitor.util.cache import cache, get_proxied
from media_impact_monitor.util.date import verify_dates
from media_impact_monitor.util.env import MEDIACLOUD_API_TOKEN
from media_impact_monitor.util.parallel import parallel_tqdm

search = mediacloud.api.SearchApi(MEDIACLOUD_API_TOKEN)
directory = mediacloud.api.DirectoryApi(MEDIACLOUD_API_TOKEN)
search.TIMEOUT_SECS = 10

Platform = Literal["onlinenews-mediacloud", "onlinenews-waybackmachine"]


@cache
def get_mediacloud_counts(
    query: str,
    end_date: date,
    start_date: date = date(2022, 1, 1),
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
    assert verify_dates(start_date, end_date)

    collection_ids = [_resolve_country(c) for c in countries] if countries else []
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


@cache
def get_mediacloud_fulltexts(
    query: str,
    end_date: date,
    start_date: date = date(2024, 5, 1),
    countries: list | None = None,
    platform: Platform = "onlinenews-mediacloud",
) -> pd.DataFrame | None:
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
    assert verify_dates(start_date, end_date)
    assert isinstance(countries, list) or countries is None
    collection_ids = [_resolve_country(c) for c in countries] if countries else None
    all_stories = []
    more_stories = True
    pagination_token = None
    while more_stories:
        page, pagination_token = search.story_list(
            query=query,
            start_date=start_date,
            end_date=end_date,
            collection_ids=collection_ids,
            platform=platform,
            pagination_token=pagination_token,
        )
        all_stories += page
        more_stories = pagination_token is not None
        if more_stories:
            decoded_token = base64.urlsafe_b64decode(pagination_token + "==").decode(
                "utf-8"
            )
            print(f"{len(all_stories)=} {pagination_token=} {decoded_token=}")
        # https://github.com/mediacloud/api-tutorial-notebooks/blob/main/MC02%20-%20attention.ipynb:
        # > As you may have noted, this can take a while for long time periods. If you look closely you'll notice that it can't be easily parallelized, because it requires content in the results to make the next call. A workaround is to divide you query up by time and query in parallel for something like each day. This can speed up the response. Also just contact us directly if you are trying to do larger data dumps, or hit up against your API quota.
    if len(all_stories) == 0:
        return None
    df = pd.DataFrame(all_stories)
    df["publish_date"] = pd.to_datetime(df["publish_date"])
    df["text"] = parallel_tqdm(
        _retrieve_text, df["url"], n_jobs=4, desc="Retrieving fulltexts"
    )
    df = df.dropna(subset=["text"]).rename(columns={"publish_date": "date"})
    df = df[
        [
            # "id",
            # "media_name",
            # "media_url",
            "title",
            "date",
            "url",
            # "language",
            # "indexed_date",
            "text",
        ]
    ]
    return df


def _retrieve_text(url: str) -> str | None:
    html = get_proxied(url, timeout=15).text
    try:
        data = extract(url=url, html_text=html)
    except BadContentError:
        return None
    # this also contains additional metadata (title, language, extraction method, ...) that could be used
    return data["text_content"]


@cache
def _resolve_country(country: str) -> int:
    # get national newspapers (regional newspapers are also available)
    results = directory.collection_list(name=f"{country} - national")["results"]
    # ignore research collections
    results = [r for r in results if "(Research Only)" not in r["name"]]
    assert len(results) == 1, f"Expected 1 result, got {len(results)} for {country}"
    return results[0]["id"]
