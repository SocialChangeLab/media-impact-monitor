import re
from collections import Counter
from datetime import datetime
from typing import Any

import pandas as pd
from tqdm.auto import tqdm

from media_impact_monitor.util.cache import get
from media_impact_monitor.util.env import RAPIDAPI_KEY

headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
}


def get_videos_for_keywords(
    keywords: str, n: int, cursor: int = 0
) -> list[dict[str, Any]]:
    """
    Get videos for a given set of keywords.
    Problem: This returns max ~150 videos, even for very popular keywords.
    Use hashtag query to get more videos.
    """
    url = "https://tiktok-scraper7.p.rapidapi.com/feed/search"
    query = {
        "keywords": keywords,
        "region": "us",  # location of the proxy server
        "count": 30,  # max: 30
        "cursor": cursor,
        "publish_time": "0",  # 0 - ALL 1 - Past 24 hours 7 - This week 30 - This month 90 - Last 3 months 180 - Last 6 months
        "sort_type": "0",  # 0 - Relevance 1 - Like count 3 - Date posted
    }
    response = get(url, headers=headers, params=query)
    # print(response.json())
    data = response.json()["data"]
    videos, cursor, has_more = data["videos"], data["cursor"], data["hasMore"]
    if has_more and cursor < n:
        videos.extend(get_videos_for_keywords(keywords=keywords, n=n, cursor=cursor))
    return videos


def get_hashtag_suggestions(keywords: str) -> Counter:
    videos = get_videos_for_keywords(keywords, n=100)
    titles = [video["title"] for video in videos]
    hashtags = [re.findall(r"#(\w+)", title) for title in titles]
    hashtags = [item for sublist in hashtags for item in sublist]
    hashtag_counts = Counter(hashtags)
    return hashtag_counts


def get_hashtag_id(hashtag: str) -> str:
    url = "https://tiktok-scraper7.p.rapidapi.com/challenge/info"
    querystring = {
        "challenge_name": hashtag,
    }
    response = get(url, headers=headers, params=querystring)
    return response.json()["data"]["id"]


def get_videos_for_hashtag_id(
    hashtag_id: str, n: int, cursor: int = 0, verbose: bool = True
) -> list[dict[str, Any]]:
    url = "https://tiktok-scraper7.p.rapidapi.com/challenge/posts"
    query = {
        "challenge_id": hashtag_id,
        "count": 20,  # max: 20
        "cursor": cursor,
    }
    response = get(url, headers=headers, params=query)
    data = response.json()["data"]
    videos, cursor, has_more = data["videos"], data["cursor"], data["hasMore"]
    if has_more and cursor < n:
        if verbose:
            print(cursor)
        videos.extend(
            get_videos_for_hashtag_id(
                hashtag_id=hashtag_id, n=n, cursor=cursor, verbose=verbose
            )
        )
    return videos


def get_videos_for_hashtag(
    hashtag: str, n: int, cursor: int = 0, verbose: bool = True
) -> list[dict[str, Any]]:
    hashtag_id = get_hashtag_id(hashtag)
    return get_videos_for_hashtag_id(hashtag_id, n=n, cursor=cursor, verbose=verbose)


def get_video_history_for_hashtag(
    hashtag: str, n: int, verbose: bool = True
) -> pd.DataFrame:
    """
    Get video history for a hashtag.
    Returns a time series of views and posts.
    Views are computed by summing the views of all videos that were posted in a given day -- that is, the views do not correspond to the dates when the videos were actually viewed. It is recommended to just use posts, or comments (see `get_comment_history_for_hashtag`).
    """
    videos = get_videos_for_hashtag(hashtag, n=n, verbose=verbose)
    df = pd.DataFrame(
        {
            "date": [datetime.fromtimestamp(video["create_time"]) for video in videos],
            "id": [video["video_id"] for video in videos],
            "title": [video["title"] for video in videos],
            "views": [video["play_count"] for video in videos],
        }
    )
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    ts = (
        df.resample("1D", on="date")
        .agg(
            {
                "views": "sum",
                "id": "count",
            }
        )
        .rename(columns={"id": "posts"})
    )
    ts = ts.reindex(pd.date_range(start=ts.index.min(), end=ts.index.max())).fillna(0)
    return ts


def get_comments_for_video(
    video_id: str, n: int, cursor: int = 0
) -> list[dict[str, Any]]:
    url = "https://tiktok-scraper7.p.rapidapi.com/comment/list"
    query = {
        "url": video_id,
        "count": 50,  # max: 50 (?)
        "cursor": cursor,
    }
    response = get(url, headers=headers, params=query)
    data = response.json()["data"]
    comments, cursor, has_more = data["comments"], data["cursor"], data["hasMore"]
    if has_more and cursor < n:
        comments.extend(get_comments_for_video(video_id, n=n, cursor=cursor))
    return comments


def get_comment_history_for_hashtag(
    hashtag: str, n_posts: int, n_comments: int, verbose: bool = True
) -> pd.DataFrame:
    videos = get_videos_for_hashtag(hashtag, n=n_posts, verbose=verbose)
    comments = [
        get_comments_for_video(video["video_id"], n=n_comments)
        for video in tqdm(videos)
        if video["comment_count"] > 0
    ]
    comments = [comment for video_comments in comments for comment in video_comments]
    comments_df = pd.DataFrame(
        {
            "date": [
                datetime.fromtimestamp(comment["create_time"]) for comment in comments
            ],
            "text": [comment["text"] for comment in comments],
            "video_id": [comment["video_id"] for comment in comments],
        }
    )
    ts = (
        comments_df.resample("1W", on="date")
        .agg(
            {
                "text": "count",
            }
        )
        .rename(columns={"text": "comments"})
    )
    ts = ts.reindex(pd.date_range(start=ts.index.min(), end=ts.index.max())).fillna(0)
    return ts
