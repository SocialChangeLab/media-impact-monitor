import os

import pandas as pd
from dotenv import load_dotenv
from media_impact_monitor.util.cache import cloudcache, get

load_dotenv()

acled_region_keys = {
    "Western Africa": 1,
    "Middle Africa": 2,
    "Eastern Africa": 3,
    "Southern Africa": 4,
    "Northern Africa": 5,
    "South Asia": 7,
    "Southeast Asia": 9,
    "Middle East": 11,
    "Europe": 12,
    "Caucasus and Central Asia": 13,
    "Central America": 14,
    "South America": 15,
    "Caribbean": 16,
    "East Asia": 17,
    "North America": 18,
    "Oceania": 19,
    "Antarctica": 20,
}


@cloudcache
def get_events(
    countries: list[str] = [], regions: list[str] = [], keyword: str | None = None
) -> pd.DataFrame:
    """Fetch protests from the ACLED API.

    API documentation: https://apidocs.acleddata.com/
    """
    limit = 1_000_000
    parameters = {
        "email": os.environ["ACLED_EMAIL"],
        "key": os.environ["ACLED_KEY"],
        "event_type": "Protests",
        "fields": "event_date|assoc_actor_1|notes",
        "limit": limit,
    }
    assert (countries or regions) and not (
        countries and regions
    ), "Specify countries or regions, not both."
    if countries:
        parameters["country"] = "|".join(countries)
    if regions:
        parameters["region"] = "|".join(
            str(acled_region_keys[region]) for region in regions
        )
    response = get("https://api.acleddata.com/acled/read", params=parameters)
    df = pd.DataFrame(response.json()["data"])
    if df.empty:
        raise ValueError("No data returned.")
    if len(df) == limit:
        raise ValueError(f"Limit of {limit} reached.")
    df["event_date"] = pd.to_datetime(df["event_date"])
    if keyword:
        df = df[
            df["assoc_actor_1"].str.lower().str.contains(keyword.lower())
            | df["notes"].str.lower().str.contains(keyword.lower())
        ]
    df = df.rename(columns={"event_date": "date"})
    return df
