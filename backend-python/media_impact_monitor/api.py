"""API for the Media Impact Monitor.

Run with: `uvicorn media_impact_monitor.api:app --reload`
Or, if necessary: `poetry run uvicorn media_impact_monitor.api:app --reload` in "backend-python/"
"""

import json
import logging
import os
from contextlib import asynccontextmanager

import pandas as pd
import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from uvicorn.logging import AccessFormatter

from media_impact_monitor.cron import setup_cron
from media_impact_monitor.events import get_events, organizers_with_id
from media_impact_monitor.fulltexts import get_fulltexts
from media_impact_monitor.impact import get_impact
from media_impact_monitor.policy import get_policy
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    CategoryCount,
    CountTimeSeries,
    Event,
    EventSearch,
    Fulltext,
    FulltextSearch,
    Impact,
    ImpactSearch,
    Organizer,
    PolicySearch,
    Response,
    TrendSearch,
)
from media_impact_monitor.util.date import get_latest_data
from media_impact_monitor.util.env import SENTRY_DSN

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


sentry_sdk.init(dsn=SENTRY_DSN, traces_sample_rate=1.0, profiles_sample_rate=1.0)


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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the exception details including the stack trace
    logger = logging.getLogger(__name__)
    logger.error(exc, exc_info=True)

    # Return a JSON response to the client with the exception details
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "details": str(exc)},
        media_type="application/json",
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
    df = get_latest_data(get_events, q)
    data = json.loads(df.to_json(orient="records"))  # convert nan to None
    return Response(query=q, data=data)


@app.post("/trend")
def _get_trend(q: TrendSearch) -> Response[TrendSearch, list[CategoryCount]]:
    """Fetch media item counts from the Media Impact Monitor database."""
    df = get_latest_data(get_trend, q)
    long_df = pd.melt(
        df.reset_index(), id_vars=["date"], var_name="topic", value_name="n_articles"
    )
    return Response(query=q, data=long_df.to_dict(orient="records"))


@app.post("/fulltexts")
def _get_fulltexts(q: FulltextSearch) -> Response[FulltextSearch, list[Fulltext]]:
    """Fetch media fulltexts from the Media Impact Monitor database."""
    fulltexts = get_latest_data(get_fulltexts, q)
    if fulltexts is None:
        return Response(query=q, data=[])
    return Response(query=q, data=fulltexts.to_dict(orient="records"))


@app.post("/impact")
def _get_impact(q: ImpactSearch):  # -> Response[ImpactSearch, Impact]:
    """Compute the impact of an event on a media trend."""
    impact = get_latest_data(get_impact, q)
    return Response(query=q, data=impact)


@app.post("/policy")
def _get_policy(q: PolicySearch):  # -> Response[PolicySearch, Policy]:
    """Fetch policy data from the Media Impact Monitor database."""
    policy = get_latest_data(get_policy, q)
    return Response(query=q, data=policy.to_dict(orient="records"))


@app.get("/organizers")
def _get_organizers() -> list[Organizer]:
    return organizers_with_id()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
