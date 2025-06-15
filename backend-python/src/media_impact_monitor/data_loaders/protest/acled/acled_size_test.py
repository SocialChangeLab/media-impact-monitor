import pytest

from media_impact_monitor.data_loaders.protest.acled.acled_size import get_size_number


@pytest.mark.parametrize(
    "size_text, expected_number",
    [
        ("100", 100),
        ("1000", 1000),
        ("500,000", 500000),
        ("1,500", 1500),
        ("between 100 and 200", 150),
        ("100-200", 150),
        ("around 100", 100),
        ("about 500", 500),
        ("approximately 1000", 1000),
        ("at least 200", 200),
        ("at most 500", 500),
        ("up to 1000", 1000),
        ("more than 500", 500),
        ("over 1000", 1000),
        ("less than 100", 100),
        ("fewer than 50", 50),
        ("under 200", 200),
        ("nearly 500", 500),
        ("several", 5),
        ("a handful", 5),
        ("a few", 5),
        ("some", 5),
        ("a group", 5),
        ("a small group", 5),
        ("small group", 5),
        ("a couple", 5),
        ("half dozen", 5),
        ("half-dozen", 5),
        ("half a dozen", 5),
        ("dozens", 50),
        ("a dozen", 50),  # TODO
        ("big group", 50),
        ("large group", 50),
        ("hundreds", 500),
        ("one hundred", 100),
        ("a couple hundred", 500),
        ("thousands", 5000),
        ("one thousand", 1000),
        ("a few thousand", 5000),
        ("tens of thousands", 50000),
        ("hundreds of thousands", 500000),
        ("two dozen", 24),
        ("five dozen", 60),
        ("twenty five", 25),
        ("None", None),
        ("na", None),
        ("nan", None),
        ("", None),
        ("no report", None),
        ("no reports", None),
    ],
)
def test_get_size_number(size_text, expected_number):
    assert get_size_number(size_text) == expected_number


def test_get_size_number_invalid_input():
    assert get_size_number("invalid") is None
