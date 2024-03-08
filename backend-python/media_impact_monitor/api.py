"""API for the Media Impact Monitor.

Run with: `uvicorn media_impact_monitor.api:app --reload`
Or, if necessary: `poetry run uvicorn media_impact_monitor.api:app --reload`
"""

from functools import partial

import pandas as pd
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from typing_extensions import Literal

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_counts as get_counts_news_online,
)
from media_impact_monitor.data_loaders.news_print.genios import (
    get_counts as get_counts_news_print,
)
from media_impact_monitor.data_loaders.protest.acled import (
    get_events as get_protests,
)
from media_impact_monitor.types_ import CountJson, CountType, EventJson

app = FastAPI()


@app.get("/", response_class=PlainTextResponse)
def welcome() -> str:
    version = "0.1.0"
    return f"Media Impact Monitor API, v{version}\nDocumentation: /docs"


parse_date = partial(pd.to_datetime, format="%Y-%m-%d")


@app.get("/events/")
def get_events(
    types: list[Literal["protest"]],
    keywords: list[str],
    organizations: list[str],
    start_date: str,
    end_date: str,
) -> list[EventJson]:
    """Fetch events from the Media Impact Monitor database."""
    events = get_protests()
    start_date = parse_date(start_date)
    end_date = parse_date(end_date)
    # ... TODO
    return events.to_dict(orient="records")[:50]


@app.get("/counts/")
def get_counts(
    types: list[CountType],
    keywords: list[str],
    start_date: str,
    end_date: str,
) -> dict[CountType, list[CountJson]]:
    """Fetch media item counts from the Media Impact Monitor database."""
    start_date = parse_date(start_date)
    end_date = parse_date(end_date)
    results = {}
    if "news_online" in types:
        results["news_online"] = get_counts_news_online().to_dict(orient="records")[:50]
    if "news_print" in types:
        results["news_print"] = get_counts_news_print().to_dict(orient="records")[:50]
    # ... TODO
    return results
