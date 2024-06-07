"""
Documentation of the Google Trends API:
- https://github.com/GeneralMills/pytrends
- https://searchanalysisguide.blogspot.com/2013/04/google-trends-what-is-partial-data.html

There is also regional data, useful for synthetic control.
For the last 90 days, data is also available with daily resolution; otherwise only weekly.
"""

import base64
from datetime import date

import pandas as pd

from media_impact_monitor.util.cache import cache, post
from media_impact_monitor.util.env import DATAFORSEO_EMAIL, DATAFORSEO_PASSWORD


@cache
def get_google_trends_counts(query: str, end_date: date) -> pd.Series:
    url = "https://api.dataforseo.com/v3/keywords_data/google_trends/explore/live"
    location_codes = {"Germany": 2276}
    payload = [
        {
            "time_range": "past_5_years",
            "type": "web",
            "keywords": [query],
            "location_code": location_codes["Germany"],
            "language_code": "de",
        }
    ]
    credentials = f"{DATAFORSEO_EMAIL}:{DATAFORSEO_PASSWORD}"
    credentials_encoded = base64.b64encode(credentials.encode()).decode()
    headers = {
        "Authorization": f"Basic {credentials_encoded}",
        "Content-Type": "application/json",
    }
    response = post(url, headers=headers, json=payload)
    data = response.json()["tasks"][0]["result"][0]["items"][0]["data"]
    df = pd.DataFrame(data)
    df["value"] = df["values"].str[0]
    # df = df[~df["missing_data"]] # this ignores data from the current day/week/month, which is not yet complete
    df = df.rename(columns={"date_from": "date", "value": "count"})
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df = df.set_index("date")["count"]
    return df
