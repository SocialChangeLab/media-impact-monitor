"""API for the Media Impact Monitor.

Run with: `uvicorn media_impact_monitor.api:app --reload`
Or, if necessary: `poetry run uvicorn media_impact_monitor.api:app --reload`
"""

from functools import partial

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from joblib import hash as joblib_hash

from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.data_loaders.protest.climate_groups import acled_keys
from media_impact_monitor.types_ import (
    Count,
    Event,
    EventSearch,
    FulltextSearch,
    Impact,
    ImpactSearch,
    TrendSearch,
)
from media_impact_monitor.util.date import verify_dates

app = FastAPI(docs_url=None, redoc_url="/docs")


@app.get("/", response_class=PlainTextResponse, include_in_schema=False)
def welcome() -> str:
    version = "0.1.2"
    return f"Media Impact Monitor API, v{version}\nDocumentation: /docs"


parse_date = partial(pd.to_datetime, format="%Y-%m-%d")


@app.post("/events/")
def get_events(q: EventSearch) -> tuple[EventSearch, list[Event]]:
    """Fetch events from the Media Impact Monitor database."""
    try:
        assert q.event_type == "protest", "Only protests are supported."
        assert q.source == "acled", "Only ACLED is supported."
        assert verify_dates(q.start_date, q.end_date)
        if q.topic == "climate_change":
            organizations = q.organizations or acled_keys
            organizations = [org for org in organizations if org in acled_keys]
        else:
            raise ValueError(f"Unsupported topic: {q.topic}")
        df = get_acled_events(
            countries=["Germany"],
            start_date=q.start_date,
            end_date=q.end_date,
            organizations=organizations,
        )
        if q.query:
            assert not any(
                sym in q.query.lower() for sym in ["or", "and", ",", "'", '"']
            ), "Query must be a single keyword."
            df = df[
                df["assoc_actor_1"].str.lower().str.contains(q.query.lower())
                | df["notes"].str.lower().str.contains(q.query.lower())
            ]
        df["date"] = df["date"].dt.date
        df["event_type"] = q.event_type
        df["source"] = q.source
        df["topic"] = q.topic
        df["event_id"] = df.apply(joblib_hash, axis=1, raw=True)
        return q, df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/trends/")
def get_trend(q: TrendSearch) -> tuple[TrendSearch, list[Count]]:
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


@app.post("/fulltexts/")
def get_fulltexts(q: FulltextSearch) -> tuple[FulltextSearch, list[Event]]:
    """Fetch fulltexts from the Media Impact Monitor database."""
    raise NotImplementedError


@app.post("/impact/")
def get_impact(q: ImpactSearch) -> tuple[ImpactSearch, Impact]:
    """Compute the impact of an event on a media trend."""
    raise NotImplementedError
