"""
Access the Bundestag API
- https://github.com/bundesAPI/dip-bundestag-api
- https://github.com/bundesAPI/dip-bundestag-api/tree/main/python-client
- https://dip.bundestag.de/%C3%BCber-dip/hilfe/api
- https://search.dip.bundestag.de/api/v1/swagger-ui/
"""

import logging
import warnings
from datetime import date
from typing import Dict

import pandas as pd
import requests

from media_impact_monitor.util.cache import cache, get
from media_impact_monitor.util.date import verify_dates
from media_impact_monitor.util.env import BUNDESTAG_API_KEY

# TODO: add exponential backoff after rate limit exceeded errors


def _call_bundestag_api(endpoint: str, params: Dict) -> list:
    """
    Call the Bundestag API with the given endpoint and parameters.

    Args:
        endpoint (str): The API endpoint to call.
        params (Dict): The parameters to include in the API request.

    Returns:
        List: A list of documents retrieved from the API.
    """

    DELAY = 0.25
    url = f"https://search.dip.bundestag.de/api/v1/{endpoint}"
    results = []

    # paginate until cursor does not change anymore
    while True:
        # print("Making new request...")
        try:
            # response = requests.get(url, params=params)
            response = get(url, params=params, sleep=DELAY)
            response.raise_for_status()
        except requests.exceptions.RequestException as req_err:
            raise RuntimeError(
                f"Request error: {req_err.response.status_code} - {req_err.response.text}"
            )
        except Exception as e:
            raise RuntimeError(f"An error occurred: {str(e)}")

        data = response.json()

        if data.get("numFound") == 0:
            # logging.warning("No entries found.")
            warnings.warn("No entries found.", UserWarning)
            return data.get("documents")

        new_cursor = data.get("cursor")
        if new_cursor == params["cursor"] or not new_cursor:  # check if different
            # print("Finished!")
            break
        else:
            # n_items = len(data.get("documents"))
            # print(f"Received {n_items} items.") # -> usually 100 per call

            results.extend(data.get("documents"))  # only add if new data
            params["cursor"] = new_cursor  # update params for next request
            # time.sleep(DELAY)

    # check final payload
    if len(results) == data.get("numFound"):
        logging.info(
            f"Success: Received a total of {len(results)} out of {data.get('numFound')} items."
        )
    else:
        raise RuntimeWarning(
            f"Data retrieval incomplete! Expected {data.get('numFound')} documents but received {len(results)}."
        )

    return results


def _clean_vorgaenge(df: pd.DataFrame):
    df = df.convert_dtypes()
    df["datum"] = pd.to_datetime(df["datum"]).dt.date

    def _ensure_list(x):  # removes missing values (NaN)
        return x if isinstance(x, list) else []

    columns_to_check = ["sachgebiet", "verkuendung", "initiative", "inkrafttreten"]
    for col in columns_to_check:
        if col in df.columns:
            df[col] = df[col].apply(_ensure_list)

    ## Extract new vars ##
    # if "verkuendung" in df.columns:
    #     df["verkuendung_pdf"] = df["verkuendung"].apply(
    #         lambda x: x[0]["pdf_url"] if x else None
    #     )

    # if "inkrafttreten" in df.columns:
    #     df["inkrafttreten_first_date"] = df["inkrafttreten"].apply(
    #         lambda x: x[0]["datum"] if x else None
    #     )
    #     df["inkrafttreten_first_date"] = pd.to_datetime(df["inkrafttreten_first_date"])

    ## calculate new vars ##
    df["initiative_n"] = df["initiative"].apply(lambda x: len(x))

    # extract deskriptor names
    # df["deskriptor_names"] = df["deskriptor"].apply(
    #     lambda x: [data["name"] for data in x]
    #     if isinstance(x, list)
    #     else []  # many missings!
    # )

    # select relevant vars
    columns_to_keep = [
        "id",
        "datum",
        "aktualisiert",
        "vorgangstyp",
        "titel",
        "abstract",
        "initiative",
        "sachgebiet",
        "beratungsstand",
        "verkuendung_pdf",
        "inkrafttreten_first_date",
    ]

    existing_columns = [col for col in columns_to_keep if col in df.columns]
    df = df.loc[:, existing_columns]

    # df.set_index("datum", inplace=True, drop=False)  # make time series

    return df


@cache
def get_bundestag_vorgaenge(
    start_date: date,
    end_date: date,
    vorgangstyp: str | None = None,
    institution: str | None = None,
    # sachgebiet: str | None = None, # only supports AND not OR
) -> pd.DataFrame:
    """Fetch 'Vorgänge' from the Bundestag DIP API.
    API documentation: https://search.dip.bundestag.de/api/v1/swagger-ui
    """
    institution = institution or "BT"  # defaults to Bundestag
    cursor = None

    ## Checks ##
    assert verify_dates(start_date, end_date)
    assert start_date >= date(2020, 1, 1), "start_date must be after 2020-01-01."
    assert end_date >= date(2020, 1, 1), "end_date must be after 2020-01-01."

    institution_options = ["BT", "BR", "BV", "EK"]
    assert (
        institution in institution_options
    ), f"Institution must be one of {institution_options}"

    vorgangstyp_options = [
        "Gesetzgebung",
        "Petition",
        "Kleine Anfrage",
        "Bericht, Gutachten, Programm",
        None,  # all
    ]
    assert (
        vorgangstyp in vorgangstyp_options
    ), f"`Sachgebiet` must be one of {vorgangstyp_options}"

    parameters = {
        "apikey": BUNDESTAG_API_KEY,
        "f.datum.start": start_date.strftime("%Y-%m-%d"),
        "f.datum.end": end_date.strftime("%Y-%m-%d"),
        "f.zuordnung": institution,
        "f.vorgangstyp": vorgangstyp,
        # "f.sachgebiet": sachgebiet,
        "format": "json",
        "cursor": cursor,
    }

    endpoint = "vorgang"
    results = _call_bundestag_api(endpoint=endpoint, params=parameters)

    df = pd.DataFrame(results)

    if df.empty:
        return df

    df = _clean_vorgaenge(df)

    # fixes API error for date overflow
    df = df[df["datum"] >= start_date]
    df = df[df["datum"] <= end_date]

    return df
