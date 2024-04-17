"""
Access the Bundestag API
- https://github.com/bundesAPI/dip-bundestag-api
- https://github.com/bundesAPI/dip-bundestag-api/tree/main/python-client
- https://dip.bundestag.de/%C3%BCber-dip/hilfe/api
- https://search.dip.bundestag.de/api/v1/swagger-ui/
"""

import os
import time
from datetime import date

import pandas as pd
import requests
from dotenv import load_dotenv
from media_impact_monitor.util.date import verify_dates

# from media_impact_monitor.util.cache import cache, get
# FIXME: -> use cached get()

# FIXME: add exponential backoff after rate limit exceeded errors
# FIXME: remove print() statements / add logging?
# FIXME: split up functions?

# load_dotenv()
## for interactive runs:
load_dotenv("/workspaces/media-impact-monitor/backend-python/media_impact_monitor/.env")


# @cache
def get_bundestag_vorgaenge(
    start_date: date | None = None,
    end_date: date | None = None,
    institution: str | None = None,
) -> pd.DataFrame:
    """Fetch 'Vorgänge' from the Bundestag DPI API.
    API documentation: https://search.dip.bundestag.de/api/v1/swagger-ui
    """
    start_date = start_date or date(2024, 1, 1) # rate limit!!
    end_date = end_date or date.today()
    institution = institution or "BT"  # defaults to Bundestag
    cursor = None

    ## Checks
    assert start_date >= date(2020, 1, 1), "Start date must be after 2020-01-01."
    assert verify_dates(start_date, end_date)

    institution_options = ["BT", "BR", "BV", "EK"]
    assert (
        institution in institution_options
    ), f"Institution must be one of {institution_options}"

    parameters = {
        "apikey": os.environ["BUNDESTAG_KEY"],
        "f.datum.start": start_date.strftime("%Y-%m-%d"),
        "f.datum.end": end_date.strftime("%Y-%m-%d"),
        "f.zuordnung": institution,
        "format": "json",
        "cursor": cursor,
    }

    url = "https://search.dip.bundestag.de/api/v1/vorgang"
    results = []

    # paginate until cursor does not change anymore
    while True:
        print("Making new request...")
        # FIXME: add timeout? try catch?
        response = requests.get(url, params=parameters)
        if response.status_code == 200:
            data = response.json()
            new_cursor = data.get("cursor")
            # FIXME: skip pagination if numFound < 10? Reliable?
            if new_cursor == cursor or not new_cursor:  # check if different
                print("Finished!")
                break
            results.extend(data.get("documents"))  # only add if new data
            len(data.get("documents"))
            cursor = new_cursor
            parameters["cursor"] = cursor  # update params for next request
            time.sleep(0.5)  # delay for 1/2 second
        else:
            print(
                "Failed to fetch data. Status code:",
                response.status_code,
                response.reason,
            )
            print(response.text)
            print("URL:", response.url)

    # check final payload
    assert (
        len(results) == data.get("numFound")
    ), f"Data retrieval incomplete! Expected {data.get('numFound')} documents but received {len(results)}."
    # FIXME: define and raise exception 
    # raise DataRetrievalError(f"Data retrieval incomplete! Expected {data.get('numFound')} documents but received {len(results)}.")
    
    print(f"Received a total of {len(results)} out of {data.get('numFound')} items.")

    # wrangle to DF
    # FIXME: decompose into transform function #DRY
    df = pd.DataFrame(results)
    df["datum"] = pd.to_datetime(df["datum"])

    df["year"] = df["datum"].dt.year
    df["month"] = df["datum"].dt.month
    df["week"] = df["datum"].dt.isocalendar().week

    # df.set_index("datum", inplace=True, drop=False) # make time series

    # extract deskriptor names
    df["deskriptor_names"] = df["deskriptor"].apply(
        lambda x: [data["name"] for data in x]
        if isinstance(x, list)
        else []  # many missings!
    )

    # TODO: add more processing steps

    return df


# @cache
def get_bundestag_plenarprotokoll_text(
    start_date: date | None = None,
    end_date: date | None = None,
    institution: str | None = None,
) -> pd.DataFrame:
    """Get 'Plenarprotokolle' fulltexts from the Bundestag DPI API.
    API documentation: https://search.dip.bundestag.de/api/v1/swagger-ui
    """
    start_date = start_date or date(2024, 1, 1)
    end_date = end_date or date.today()
    institution = institution or "BT"  # defaults to Bundestag
    cursor = None

    ## Checks
    assert start_date >= date(2020, 1, 1), "Start date must be after 2020-01-01."
    assert verify_dates(start_date, end_date)

    institution_options = ["BT", "BR", "BV", "EK"]
    assert (
        institution in institution_options
    ), f"Institution must be one of {institution_options}"

    parameters = {
        "apikey": os.environ["BUNDESTAG_KEY"],
        "f.datum.start": start_date.strftime("%Y-%m-%d"),
        "f.datum.end": end_date.strftime("%Y-%m-%d"),
        "f.zuordnung": institution,
        "format": "json",
        "cursor": cursor,
    }

    url = "https://search.dip.bundestag.de/api/v1/plenarprotokoll-text"
    results = []

    # paginate until cursor does not change anymore
    while True:
        print("Making new request...")
        response = requests.get(url, params=parameters)
        if response.status_code == 200:
            data = response.json()
            new_cursor = data.get("cursor")
            if new_cursor == cursor or not new_cursor:  # check if different
                print("Finished!")
                break
            results.extend(
                data.get("documents")
            )  # only add if there is new data on the next page
            cursor = new_cursor
            parameters["cursor"] = cursor  # update params for next request
            time.sleep(0.5)  # delay for 1/2 second
        else:
            print("Failed to fetch data. Status code:", response.status_code)

    # check final payload
    assert (
        len(results) == data.get("numFound")
    ), f"Data retrieval incomplete! Expected {data.get('numFound')} documents but received {len(results)}."
    print(f"Received a total of {len(results)} out of {data.get('numFound')} items.")

    # wrangle to DF
    df = pd.DataFrame(results)
    df["datum"] = pd.to_datetime(df["datum"])

    df["year"] = df["datum"].dt.year
    df["month"] = df["datum"].dt.month
    df["week"] = df["datum"].dt.isocalendar().week

    # df.set_index("datum", inplace=True, drop=False) # make time series

    # TODO: add more processing steps (e.g., clean text depending on future needs)

    return df
