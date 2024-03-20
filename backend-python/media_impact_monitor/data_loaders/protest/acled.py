import os
from datetime import date

import pandas as pd
from dotenv import load_dotenv
from media_impact_monitor.util.cache import cloudcache, get
from media_impact_monitor.util.date import verify_dates

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
def get_acled_events(
    countries: list[str] = [],
    regions: list[str] = [],
    start_date: date | None = None,
    end_date: date | None = None,
    organizations: list[str] | None = None,
) -> pd.DataFrame:
    """Fetch protests from the ACLED API.

    API documentation: https://apidocs.acleddata.com/
    """
    start_date = start_date or date(2020, 1, 1)
    end_date = end_date or date.today()
    assert start_date >= date(2020, 1, 1), "Start date must be after 2020-01-01."
    assert verify_dates(start_date, end_date)

    limit = 1_000_000
    parameters = {
        "email": os.environ["ACLED_EMAIL"],
        "key": os.environ["ACLED_KEY"],
        "event_type": "Protests",
        "event_date": f"{start_date}|{end_date}",
        "event_date_where": "BETWEEN",
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
    if organizations:
        parameters["assoc_actor_1"] = "|".join(organizations)
    response = get("https://api.acleddata.com/acled/read", params=parameters)
    df = pd.DataFrame(response.json()["data"])
    if df.empty:
        raise ValueError("No data returned.")
    if len(df) == limit:
        raise ValueError(f"Limit of {limit} reached.")
    df["date"] = pd.to_datetime(df["event_date"], format="%Y-%m-%d")
    df["organizations"] = df["assoc_actor_1"].str.split("; ")
    df["description"] = df["notes"]
    return df[["date", "description", "organizations"]]
