import pytest
from cloudpathlib import CloudPath
from media_impact_monitor.paths import cache, data, src


def test_src_path():
    assert src.exists(), "The 'src' path should exist."
    assert src.is_dir(), "The 'src' path should be a directory."
    assert any(src.iterdir()), "The 'src' directory should not be empty."


def test_cache_path():
    """
    The 'cache' path may not exist initially. If it doesn't exist, it will be created.
    """
    if not cache.exists():
        cache.mkdir(parents=True)
    assert cache.exists(), "The 'cache' path should exist after creation."
    assert cache.is_dir(), "The 'cache' path should be a directory."


def test_data_path():
    """
    This test requires valid credentials for the gs://protest-impact-policy bucket.
    If no credentials are available, this test will be skipped.
    """
    try:
        contents = list(data.iterdir())
    except Exception as e:
        pytest.fail(f"An exception occurred while accessing the 'data' CloudPath: {e}")
    assert any(contents), "The 'data' CloudPath should not be empty."
