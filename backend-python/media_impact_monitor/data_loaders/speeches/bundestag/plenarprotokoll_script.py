# **Access the Bundestag API**
# - https://dip.bundestag.de/%C3%BCber-dip/recherche
# - https://github.com/bundesAPI/dip-bundestag-api
# - https://github.com/bundesAPI/dip-bundestag-api/tree/main/python-client
# - https://dip.bundestag.de/%C3%BCber-dip/hilfe/api
# - https://search.dip.bundestag.de/api/v1/swagger-ui/


import json
import os
from datetime import date

import matplotlib.pyplot as plt
import pandas as pd
import requests
from dotenv import load_dotenv

# PREVIOUS_MAX_ROWS = pd.options.display.max_rows
# pd.options.display.max_columns = 20
# pd.options.display.max_rows = 20
# pd.options.display.max_colwidth = 80
# np.set_printoptions(precision=4, suppress=True)

load_dotenv("/workspaces/media-impact-monitor/backend-python/media_impact_monitor/.env")

## TODO: turn into function
## Set input params
start_date = date(2024, 4, 1) # year, month, day
end_date = date.today()
institution = "BT"
cursor = None

parameters = {
    "apikey": os.environ["BUNDESTAG_KEY"],
    "f.datum.start": start_date.strftime("%Y-%m-%d"),
    "f.datum.end": end_date.strftime("%Y-%m-%d"),
    "f.zuordnung": institution,
    "format": "json",
    "cursor": cursor,
}

## For specific IDs
# https://search.dip.bundestag.de/api/v1/{ressourcentyp}/{id}

ressourcentyp = "plenarprotokoll-text"
# ressourcentyp = "vorgang"
url = f"https://search.dip.bundestag.de/api/v1/{ressourcentyp}"
results = []

# paginate until cursor does not change anymore
# FIXME: add rate limiting? delay
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
    else:
        print("Failed to fetch data. Status code:", response.status_code, response.reason)
        print(response.text)
        print("URL:", response.url)
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
df["week_year"] = df["year"].astype(str) + "-" + df["week"].astype(str)

df.set_index("datum", inplace=True, drop=False)  # make time series

### EDA ###

### Vorgänge ###

## Sachgebiete
sachgebiet_counts = df["sachgebiet"].value_counts()
sachgebiet_all_counts = df["sachgebiet"].explode().value_counts()

df["deskriptor_names"] = df["deskriptor"].apply(
    lambda x: [data["name"] for data in x] if isinstance(x, list) else []
    # handles missing lists (nan)
)
deskriptor_names_counts = df["deskriptor_names"].explode().value_counts()

## Find matching deskriptors
keywords = ["Klimaschutz", "Erneuerbare Energie", "Klimaneutralität"]
# FIXME: add more topical deskriptors!
matched = df[
    df["deskriptor_names"].apply(
        lambda x: any(keyword in x for keyword in keywords)
        if isinstance(x, list)
        else False
    )
]

df["keyword_match"] = df["deskriptor_names"].apply(
    lambda x: any(keyword in x for keyword in keywords)
    if isinstance(x, list)
    else False
)

# matched_counts = matched.groupby("week_year").size()

weekly_counts = matched.resample("W").count()

plt.figure(figsize=(15, 5))
plt.plot(weekly_counts.index, weekly_counts["id"])
plt.title("Weekly Counts")
plt.xlabel("Week")
plt.ylabel("Number of Occurrences")
plt.grid(True)
plt.show()


### Plenarprotokolle ###

# https://arc.net/l/quote/iinxitre (Variables)

## Title of Plenarsitzung
# example: Protokoll der 1. Sitzung des 19. Deutschen Bundestages
# -> not relevant in terms of content!
df["titel"][0]

## Zusammenfassung der ersten 4 zugehörigen Vorgänge
df["vorgangsbezug"][0][0]

## Total number (usually much higher)
df["vorgangsbezug_anzahl"]
df["vorgangsbezug_anzahl"].mean()


# how to get all the titles?
# maybe first retrieve list and then retrieve fulltexts based on matched titles?


# Export
file_name = "plenarprotokoll_data.json"
with open(file_name, "w") as file:
    json.dump(results, file, ensure_ascii=False, indent=4)
