from datetime import date

import pandas as pd

from media_impact_monitor.util.cache import cache, get
from media_impact_monitor.util.date import verify_dates


@cache
def get_genios_counts(
    query: str,
    end_date: date,
    start_date: date,
) -> tuple[pd.Series, list[str]]:
    assert verify_dates(start_date, end_date)
    response = get(
        "https://www.genios.de/api/searchResult/Alle/Presse",
        params={
            "requestText": query,
            "size": 0,
            "sort": "BY_DATE",
            "order": "desc",
            "resultListType": "DEFAULT",
            "date": [
                f"from_{start_date.strftime('%d.%m.%Y')}",
                f"to_{end_date.strftime('%d.%m.%Y')}",
            ],
            "getDateHistograms": "day",
        },
    )
    data = response.json()["aggregations"]["day"]
    data = [{"date": k, "count": v["count"]} for k, v in data.items()]
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y").dt.date
    df = df.set_index("date")
    # there is a bug that sets the count at day -1 to 0
    df = df[df.index >= start_date]
    return df["count"]
