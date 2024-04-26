from media_impact_monitor.data_loaders.web.google_trends import get_google_trends_counts


def test_get_google_trends_counts():
    df = get_google_trends_counts("corona")
    assert not df.empty
    assert df.columns == ["count"]
    assert df.index.name == "date"
    assert df.index.is_monotonic_increasing
    assert df["count"].dtype == int
    assert df["count"].min() >= 0
    assert df["count"].max() >= 0
    assert df["count"].max() == 100
    assert df["count"].sum() >= 0
    assert df["count"].sum() <= 100 * len(df)
