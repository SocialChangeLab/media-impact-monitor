# %load_ext autoreload
# %autoreload 2

# poetry run pytest -k "get_policy" -v

from datetime import date

import pandas as pd
import pytest
from pydantic import ValidationError
from pytest import raises

from media_impact_monitor.policy import get_policy
from media_impact_monitor.types_ import PolicySearch


def test_get_policy_with_defaults():
    """Test that events can be retrieved by their IDs."""
    df = get_policy(PolicySearch())

    assert df is not None
    assert isinstance(df, pd.DataFrame)
    assert all(df["vorgangstyp"] == "Gesetzgebung")


def test_get_policy_with_valid_parameters():
    # Test with valid parameters
    start_date = date(2023, 1, 1)
    end_date = date(2023, 3, 1)
    policy_type = "Kleine Anfrage"
    topic = "climate_change"

    df = get_policy(
        PolicySearch(
            start_date=start_date,
            end_date=end_date,
            policy_type=policy_type,
            topic=topic,
        )
    )
    assert df is not None
    assert isinstance(df, pd.DataFrame)
    assert all(df["vorgangstyp"] == policy_type)
    assert len(df) > 50


def test_get_policy_invalid_policy_type():
    start_date = date(2023, 1, 1)
    end_date = date(2023, 3, 1)
    policy_type = "Invalid Policy Type"
    topic = None

    with pytest.raises(ValidationError):
        get_policy(
            PolicySearch(
                start_date=start_date,
                end_date=end_date,
                policy_type=policy_type,
                topic=topic,
            )
        )


def test_get_policy_invalid_topic():
    start_date = date(2023, 1, 1)
    end_date = date(2023, 3, 1)
    policy_type = None
    topic = "invalid_topic"

    with pytest.raises(ValidationError):
        get_policy(
            PolicySearch(
                start_date=start_date,
                end_date=end_date,
                policy_type=policy_type,
                topic=topic,
            )
        )


def test_get_policy_no_results():
    start_date = date(2023, 1, 1)
    end_date = date(2023, 1, 1)
    policy_type = None
    topic = None

    df = get_policy(
        PolicySearch(
            start_date=start_date,
            end_date=end_date,
            policy_type=policy_type,
            topic=topic,
        )
    )
    # TODO: test for warning

    assert df.empty


# def test_get_policy_large_request():
#     start_date = date(2023, 1, 1)
#     end_date = date(2023, 12, 31)
#     policy_type = None  # all
#     topic = None  # all

#     df = get_policy(
#         PolicySearch(
#             start_date=start_date,
#             end_date=end_date,
#             policy_type=policy_type,
#             topic=topic,
#         )
#     )
