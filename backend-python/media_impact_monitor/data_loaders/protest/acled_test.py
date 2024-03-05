import os
import pytest
from media_impact_monitor.data_loaders.protest.acled import get_protests


def test_get_protests_with_keyword():
    test_countries = ["Germany", "Burkina Faso"]
    test_keyword = "climate"
    assert (
        "ACLED_EMAIL" in os.environ and "ACLED_KEY" in os.environ
    ), "Environment variables for ACLED API access are not set."
    df = get_protests(countries=test_countries, keyword=test_keyword)
    assert not df.empty, "The dataframe returned is unexpectedly empty."
    assert (
        df["notes"].str.lower().str.contains(test_keyword.lower()).all()
    ), "Keyword not found in the notes."
    expected_columns = ["date", "assoc_actor_1", "notes"]
    assert all(
        column in df.columns for column in expected_columns
    ), "Not all expected columns are present in the returned DataFrame."
    movements = ["Fridays for Future", "Extinction Rebellion"]
    assert (
        df["assoc_actor_1"].str.contains(movements[0]).sum() > 10
    ), "Fridays for Future not found in the assoc_actor_1 column."
    assert (
        df["assoc_actor_1"].str.contains(movements[1]).sum() > 10
    ), "Extinction Rebellion not found in the assoc_actor_1 column."


def test_get_protests_fail_with_both_countries_and_regions():
    """Test that the function raises an assertion error when both countries and regions are specified."""
    with pytest.raises(AssertionError):
        get_protests(countries=["United States"], regions=["Western Africa"])
