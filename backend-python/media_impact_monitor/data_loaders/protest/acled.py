from datetime import date

import pandas as pd

from media_impact_monitor.data_loaders.protest.acled_size import (
    get_size_number,
    get_size_text,
)
from media_impact_monitor.util.cache import cache, get
from media_impact_monitor.util.date import verify_dates
from media_impact_monitor.util.env import ACLED_EMAIL, ACLED_KEY

info = """
ACLED (Armed Conflict Location & Event Data Project) is a project that tracks political violence and protest events around the world. The data is collected from reports by local and international news sources, and is updated on a weekly basis. The ACLED API provides access to the data.

We use the `assoc_actor_1` field for identifying organizations, ignoring the `assoc_actor_2` field because its use is inconsistent.
"""

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


@cache
def get_acled_events(
    end_date: date,
    start_date: date = date(2020, 1, 1),
    countries: list[str] = [],
    regions: list[str] = [],
) -> pd.DataFrame:
    """Fetch protests from the ACLED API.

    API documentation: https://apidocs.acleddata.com/
    """
    assert start_date >= date(2020, 1, 1), "Start date must be after 2020-01-01."
    assert verify_dates(start_date, end_date)

    limit = 1_000_000
    parameters = {
        "email": ACLED_EMAIL,
        "key": ACLED_KEY,
        "event_type": "Protests",
        "event_date": f"{start_date.strftime('%Y-%m-%d')}|{end_date.strftime('%Y-%m-%d')}",
        "event_date_where": "BETWEEN",
        "fields": "event_date|sub_event_type|assoc_actor_1|country|admin1|admin2|notes|tags",
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
        return df
    if len(df) == limit:
        raise ValueError(f"Limit of {limit} reached.")
    df["date"] = pd.to_datetime(df["event_date"]).dt.date
    df["region"] = df["admin1"]
    df["city"] = df["admin2"]
    df["event_type"] = df["sub_event_type"]
    df = process_orgs(df)
    df["size_text"] = df["tags"].apply(get_size_text)
    df["size_number"] = df["size_text"].apply(get_size_number)
    df["description"] = df["notes"]
    # df["source"] = (
    #     "adapted from: Armed Conflict Location & Event Data Project (ACLED); www.acleddata.com"
    # )
    df["source"] = "acled"
    return df[
        [
            "date",
            "event_type",
            "country",
            "region",
            "city",
            "organizers",
            "size_text",
            "size_number",
            "description",
            "source",
        ]
    ]


def process_orgs(df):
    group_blocklist = [
        "Students (Germany)",
        "Labor Group (Germany)",
        "Women (Germany)",
        "Christian Group (Germany)",
    ]
    df = df.rename(columns={"assoc_actor_1": "organizers"})
    df["organizers"] = (
        df["organizers"]
        .str.split("; ")
        .apply(lambda x: [] if x == [""] else x)
        # remove descriptors that are not actual organizations:
        .apply(lambda x: [org for org in x if org not in group_blocklist])
    )
    # make names more consistent:
    df = df.apply(rename_org, axis=1)
    return df


def rename_org(row):
    """
    Rationalize ACLED keys to match the more consistent names defined in `climate_orgs.py`.
    """
    orgs = [
        org.replace(
            "BUND: German Federation for the Environment and Nature Conservation",
            "BUND",
        )
        .replace("FFF: Fridays for Future", "Fridays for Future")
        .replace("XR: Extinction Rebellion", "Extinction Rebellion")
        .replace("DxE: Direct Action Everywhere", "Direct Action Everywhere")
        .replace("NB: Emergency Break", "Emergency Break")
        for org in row["organizers"]
    ]
    if row["country"] == "United Kingdom":
        orgs = [org.replace("Just Stop Oil", "Just Stop Oil (UK)") for org in orgs]
    if row["country"] == "Norway":
        orgs = [org.replace("Just Stop Oil", "Just Stop Oil (Norway)") for org in orgs]
    row["organizers"] = orgs
    return row
