"""API for the Media Impact Monitor.

Run with: `uvicorn media_impact_monitor.api:app --reload`
Or, if necessary: `poetry run uvicorn media_impact_monitor.api:app --reload`
"""

from functools import partial

import pandas as pd
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

from media_impact_monitor.types_ import (
    Count,
    Event,
    EventSearch,
    FulltextSearch,
    Impact,
    ImpactSearch,
    TrendSearch,
)

app = FastAPI()


@app.get("/", response_class=PlainTextResponse)
def welcome() -> str:
    version = "0.1.2"
    return f"Media Impact Monitor API, v{version}\nDocumentation: /docs"


parse_date = partial(pd.to_datetime, format="%Y-%m-%d")


@app.get("/events/")
def get_events(**search: EventSearch) -> tuple[EventSearch, list[Event]]:
    """Fetch events from the Media Impact Monitor database."""
    pass
    # events = get_acled_events(keyword=query[0])
    # start_date = parse_date(start_date)
    # end_date = parse_date(end_date)
    # # ... TODO
    # return events.to_dict(orient="records")[:50]


@app.get("/trends/")
def get_trends(**search: TrendSearch) -> tuple[TrendSearch, list[Count]]:
    """Fetch media item counts from the Media Impact Monitor database."""
    pass
    # start_date = parse_date(start_date)
    # end_date = parse_date(end_date)
    # results = {}
    # if "news_online" in trend_type:
    #     results["news_online"] = get_mediacloud_counts(
    #         query=query[0],
    #         start_date=start_date,
    #         end_date=end_date,
    #     ).to_dict(orient="records")[:50]
    # if "news_print" in trend_type:
    #     results["news_print"] = get_genios_counts(
    #         query=query[0],
    #         start_date=start_date,
    #         end_date=end_date,
    #     ).to_dict(orient="records")[:50]
    # # ... TODO
    # return results


@app.get("/fulltexts/")
def get_fulltexts(**search: FulltextSearch) -> tuple[FulltextSearch, list[Event]]:
    """Fetch fulltexts from the Media Impact Monitor database."""
    raise NotImplementedError


@app.get("/impact/")
def get_impact(**search: ImpactSearch) -> tuple[ImpactSearch, Impact]:
    """Compute the impact of an event on a media trend."""
