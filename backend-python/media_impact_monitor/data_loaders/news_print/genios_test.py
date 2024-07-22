from datetime import date

import pandas as pd
import pytest

from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts


# @pytest.mark.skip(reason="The Genios API is currently down.")
def test_get_counts_genios():
    df = get_genios_counts(
        "Fridays for Future",
        start_date=date(2023, 6, 1),
        end_date=date(2023, 12, 1),
    )
    df.index = pd.to_datetime(df.index)
    assert not df.empty, "The dataframe returned is unexpectedly empty."
    assert (
        df.index >= "2023-06-01"
    ).all(), "The returned dataframe contains dates before the start date."
    assert (
        df.index <= "2023-12-01"
    ).all(), "The returned dataframe contains dates after the end date."
    assert (df >= 0).all(), "The returned dataframe contains negative counts."
    print(df.diff().abs())
    assert (
        df.diff().abs().fillna(0) <= 1000
    ).all(), "The returned dataframe contains a count change of more than 1000."
    # assume more counts in September (due to global climate strike) than in August
    assert (
        df.resample("ME").sum()["2023-09"].item()
        > df.resample("ME").sum()["2023-08"].item()
    ), "The count in September is not higher than in August."
    assert (
        df.resample("ME").sum() < 10_000
    ).all(), "The count per month is higher than 10,000 for some months."
    assert (
        df.resample("ME").sum() > 10
    ).all(), "The count per month is lower than 30 for some months."
