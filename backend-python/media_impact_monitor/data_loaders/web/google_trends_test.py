from media_impact_monitor.data_loaders.web.google_trends import get_google_trends_counts


def test_get_google_trends_counts():
    df = get_google_trends_counts("corona")
    assert not df.empty
    assert df.index.name == "date"
    assert df.index.is_monotonic_increasing
    assert df.dtype == int
    assert df.min() >= 0
    assert df.max() >= 0
    assert df.max() == 100
    assert df.sum() >= 0
    assert df.sum() <= 100 * len(df)
