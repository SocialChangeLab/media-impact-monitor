import pytest
import pandas as pd
from datetime import datetime, timedelta
from collections import Counter
from media_impact_monitor.data_loaders.social_media.tiktok import (
    get_videos_for_keywords,
    get_hashtag_suggestions,
    get_hashtag_id,
    get_videos_for_hashtag_id,
    get_videos_for_hashtag,
    get_video_history_for_hashtag,
    get_comments_for_video,
    get_comment_history_for_hashtag,
)


@pytest.mark.slow
def test_get_videos_for_keywords():
    videos = get_videos_for_keywords("climate change", n=50)
    assert len(videos) > 0
    assert isinstance(videos[0], dict)
    assert "title" in videos[0]
    assert "video_id" in videos[0]


@pytest.mark.slow
def test_get_hashtag_suggestions():
    suggestions = get_hashtag_suggestions("climate change")
    assert len(suggestions) > 0
    assert isinstance(suggestions, Counter)


@pytest.mark.slow
def test_get_hashtag_id():
    hashtag_id = get_hashtag_id("climatechange")
    assert isinstance(hashtag_id, str)
    assert len(hashtag_id) > 0


@pytest.mark.slow
def test_get_videos_for_hashtag_id():
    hashtag_id = get_hashtag_id("climatechange")
    videos = get_videos_for_hashtag_id(hashtag_id, n=50)
    assert len(videos) > 0
    assert isinstance(videos[0], dict)
    assert "title" in videos[0]
    assert "video_id" in videos[0]


@pytest.mark.slow
def test_get_videos_for_hashtag():
    videos = get_videos_for_hashtag("climatechange", n=50)
    assert len(videos) > 0
    assert isinstance(videos[0], dict)
    assert "title" in videos[0]
    assert "video_id" in videos[0]


@pytest.mark.slow
def test_get_video_history_for_hashtag():
    history = get_video_history_for_hashtag("climatechange", n=100)
    assert isinstance(history, pd.DataFrame)
    assert len(history) > 0
    assert "views" in history.columns
    assert "posts" in history.columns


@pytest.mark.slow
def test_get_comments_for_video():
    videos = get_videos_for_hashtag("climatechange", n=1)
    video_id = videos[0]["video_id"]
    comments = get_comments_for_video(video_id, n=50)
    assert len(comments) > 0
    assert isinstance(comments[0], dict)
    assert "text" in comments[0]


@pytest.mark.slow
def test_get_comment_history_for_hashtag():
    history = get_comment_history_for_hashtag(
        "climatechange", n_posts=10, n_comments=10
    )
    assert isinstance(history, pd.DataFrame)
    assert len(history) > 0
    assert "comments" in history.columns


@pytest.mark.slow
def test_data_freshness():
    videos = get_videos_for_hashtag("climatechange", n=50)
    latest_video_date = max(
        datetime.fromtimestamp(video["create_time"]) for video in videos
    )
    assert latest_video_date >= datetime.now() - timedelta(
        days=7
    ), "No recent videos found"


@pytest.mark.slow
def test_video_content():
    videos = get_videos_for_keywords("climate change", n=50)
    climate_related_words = [
        "climate",
        "environment",
        "global warming",
        "sustainability",
    ]
    assert any(
        any(word in video["title"].lower() for word in climate_related_words)
        for video in videos
    ), "No climate-related content found in video titles"
