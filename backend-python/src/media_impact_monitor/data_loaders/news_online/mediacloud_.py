import random
from datetime import date, timedelta
from typing import Literal
from time import sleep

import mediacloud.api
import pandas as pd
from tqdm import tqdm
from dateutil.relativedelta import relativedelta
from mcmetadata import extract
from mcmetadata.exceptions import BadContentError

from media_impact_monitor.util.cache import cache, get
from media_impact_monitor.util.date import verify_dates
from media_impact_monitor.util.env import MEDIACLOUD_API_TOKEN
from media_impact_monitor.util.parallel import parallel_tqdm

search = mediacloud.api.SearchApi(MEDIACLOUD_API_TOKEN)
directory = mediacloud.api.DirectoryApi(MEDIACLOUD_API_TOKEN)

Platform = Literal["onlinenews-mediacloud", "onlinenews-waybackmachine"]


@cache(ignore=["timeout"])
def _story_count_over_time(timeout: int = 10, **kwargs):
    # currently not used because it's extremely slow and unreliable
    search.TIMEOUT_SECS = timeout
    return search.story_count_over_time(**kwargs)


def get_mediacloud_counts(
    query: str,
    end_date: date,
    start_date: date,
    countries: list | None = None,
    platform: Platform = "onlinenews-mediacloud",
) -> tuple[pd.Series | None, list[str]]:
    assert verify_dates(start_date, end_date)

    collection_ids = [_resolve_country(c) for c in countries] if countries else None
    collection_ids = (
        [item for sublist in collection_ids for item in sublist]
        if collection_ids
        else None
    )
    counts = _story_count_over_time(
        query=query,
        start_date=start_date,
        end_date=end_date,
        collection_ids=collection_ids,
        platform=platform,
    )
    if counts is None:
        return None, []
    counts = pd.DataFrame(counts).set_index("date")["count"]
    return counts, []

@cache
def _story_list(**kwargs):
    sleep(30) # undocumented rate limit, see https://github.com/mediacloud/api-client/issues/107#issuecomment-2977041385
    return search.story_list(**kwargs)


def _story_list_all_pages(
    query: str,
    start_date: date,
    end_date: date,
    collection_ids: list[int] | None = None,
    platform: Platform = "onlinenews-mediacloud",
    sample_frac: float = 1,
    verbose: bool = False,
):
    all_stories = []
    more_stories = True
    pagination_token = None
    while more_stories:
        page, pagination_token = _story_list(
            query=query,
            start_date=start_date,
            end_date=end_date,
            collection_ids=collection_ids,
            platform=platform,
            pagination_token=pagination_token,
        )
        all_stories += page
        more_stories = pagination_token is not None
        if verbose:
            print(
                f"retrieved metadata for {len(all_stories)} stories for month {start_date.year}-{start_date.month}"
            )
        print("pagination_token", pagination_token)
        # https://github.com/mediacloud/api-tutorial-notebooks/blob/main/MC02%20-%20attention.ipynb:
        # > As you may have noted, this can take a while for long time periods. If you look closely you'll notice that it can't be easily parallelized, because it requires content in the results to make the next call. A workaround is to divide you query up by time and query in parallel for something like each day. This can speed up the response. Also just contact us directly if you are trying to do larger data dumps, or hit up against your API quota.
    # take a 1% sample of stories
    sample_size = int(sample_frac * len(all_stories))
    random.seed(0)
    all_stories = random.sample(all_stories, sample_size)
    return all_stories

def _slice_date_range(start: date, end: date) -> list[tuple[date, date]]:
    result = []
    current = start.replace(day=1)
    while current <= min(end, date.today()):
        next_month = current + relativedelta(months=1)
        last_day = min(next_month - timedelta(days=1), date.today())
        result.append((current, last_day))
        current = next_month
    return result


@cache
def _story_list_split_monthly(
    query: str,
    start_date: date,
    end_date: date,
    collection_ids: list[int] | None = None,
    platform: Platform = "onlinenews-mediacloud",
    sample_frac: float = 1,
):
    def func(start_and_end):
        start, end = start_and_end
        return _story_list_all_pages(
            query=query,
            start_date=start,
            end_date=end,
            collection_ids=collection_ids,
            platform=platform,
            sample_frac=sample_frac,
        )

    label = "Downloading metadata by month"
    stories_lists = [func(start_and_end) for start_and_end in tqdm(_slice_date_range(start_date, end_date), desc=f"{label:<{40}}")]
    stories = [s for sl in stories_lists for s in sl]
    if len(stories) == 0:
        return None
    df = pd.DataFrame(stories)
    df["publish_date"] = pd.to_datetime(df["publish_date"]).dt.date
    return df


@cache
def get_mediacloud_fulltexts(
    query: str,
    end_date: date,
    start_date: date | None = None,
    countries: list | None = None,
    platform: Platform = "onlinenews-mediacloud",
    sample_frac: float = 1,
) -> pd.DataFrame | None:
    start_date = max(start_date or date(2022, 1, 1), date(2022, 1, 1))
    assert verify_dates(start_date, end_date)
    assert isinstance(countries, list) or countries is None
    collection_ids = [_resolve_country(c) for c in countries] if countries else None
    collection_ids = (
        [item for sublist in collection_ids for item in sublist]
        if collection_ids
        else None
    )
    df = _story_list_split_monthly(
        query=query,
        start_date=start_date,
        end_date=end_date,
        collection_ids=collection_ids,
        platform=platform,
        sample_frac=sample_frac,
    )
    if df is None:
        return None
    df = df[~df["url"].str.contains("news.de")]
    label = "Downloading fulltexts"
    responses = parallel_tqdm(get, df["url"].tolist(), desc=f"{label:<{40}}", n_jobs=8)
    urls_and_responses = list(zip(df["url"], responses))
    label = "Extracting fulltexts"
    df["text"] = parallel_tqdm(_extract, urls_and_responses, desc=f"{label:<{40}}")
    df = df.dropna(subset=["text"]).rename(columns={"publish_date": "date"})
    df = df[(df["date"] >= start_date) & (df["date"] <= end_date)]
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


def _extract(url_and_response):
    url, response = url_and_response
    if response is None or response.status_code != 200:
        return None
    try:
        # this also contains additional metadata (title, language, extraction method, ...) that could be used
        return cache(extract)(url, response.text)["text_content"]
    except BadContentError:
        return None


@cache
def _resolve_country(country: str) -> list[int]:
    # get national newspapers
    results = directory.collection_list(name=f"{country} - national")["results"]
    # ignore research collections
    results = [r for r in results if "(Research Only)" not in r["name"]]
    # if there is a specific collection for MIM, use it!
    if any("Media Impact Monitor" in r["name"] for r in results):
        results = [r for r in results if "Media Impact Monitor" in r["name"]]
    if len(results) != 1:
        print(f"Expected 1 result, got {len(results)} for {country}")
    national = results[0]["id"]
    # get regional newspapers
    results = directory.collection_list(name=f"{country} - state & local")["results"]
    regional = results[0]["id"]
    return [national, regional]
