"""API for the Media Impact Monitor.

Run with: `uvicorn media_impact_monitor.api:app --reload`
Or, if necessary: `poetry run uvicorn media_impact_monitor.api:app --reload` in "backend-python/"
"""

import json
import logging
import os
from contextlib import asynccontextmanager

import pandas as pd
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from uvicorn.logging import AccessFormatter

from media_impact_monitor.cron import setup_cron
from media_impact_monitor.events import get_events
from media_impact_monitor.impact import get_impact
from media_impact_monitor.policy import get_policy
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    CountTimeSeries,
    Event,
    EventSearch,
    FulltextSearch,
    Impact,
    ImpactSearch,
    Policy,
    PolicySearch,
    Response,
    TrendSearch,
)

git_commit = (os.getenv("VCS_REF") or "")[:7]
build_date = (os.getenv("BUILD_DATE") or "WIP").replace("T", " ")

metadata = dict(
    title="Media Impact Monitor API",
    version=f"0.1.0+{git_commit} ({build_date})",
    contact=dict(
        name="Social Change Lab",
        url="https://github.com/socialchangelab/media-impact-monitor",
    ),
    redoc_url="/docs",
    # the original Swagger UI does not properly display POST parameters, so we disable it
    docs_url=None,
)


# this is run only once at startup, rather than for every request
@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # setup logging to also include datetime
    logger = logging.getLogger("uvicorn.access")
    if logger.handlers:
        console_formatter = AccessFormatter(
            "{asctime} {levelprefix} {message}", style="{", use_colors=True
        )
        logger.handlers[0].setFormatter(console_formatter)
    # setup cron to regularly fills the cache
    setup_cron()
    yield


app = FastAPI(**metadata, lifespan=app_lifespan)

# configure cross-origin resource sharing
# = which websites are allowed to access the API
# (enforced by the browsers for "security" reasons)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs")


@app.get("/info")
def get_info() -> dict:
    """Get metadata (title, version, etc.)."""
    return metadata


@app.post("/events")
def _get_events(q: EventSearch) -> Response[EventSearch, list[Event]]:
    """Fetch events from the Media Impact Monitor database."""
    df = get_events(q)
    data = json.loads(df.to_json(orient="records"))  # convert nan to None
    return Response(query=q, data=data)


@app.post("/trend")
def _get_trend(q: TrendSearch):  # -> Response[TrendSearch, CountTimeSeries]:
    """Fetch media item counts from the Media Impact Monitor database."""
    df = get_trend(q)
    long_df = pd.melt(
        df.reset_index(), id_vars=["date"], var_name="topic", value_name="n_articles"
    )
    return Response(query=q, data=long_df.to_dict(orient="records"))


@app.post("/fulltexts")
def _get_fulltexts(q: FulltextSearch) -> Response[FulltextSearch, list[Event]]:
    """Fetch fulltexts from the Media Impact Monitor database."""
    raise NotImplementedError


@app.post("/impact")
def _get_impact(q: ImpactSearch):  # -> Response[ImpactSearch, Impact]:
    """Compute the impact of an event on a media trend."""
    impact = get_impact(q)
    return Response(query=q, data=impact)


@app.post("/policy")
def _get_policy(q: PolicySearch):  # -> Response[PolicySearch, Policy]:
    """Fetch policy data from the Media Impact Monitor database."""
    policy = get_policy(q)
    return Response(query=q, data=policy)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
