"""API for the Media Impact Monitor.

Run with: `uvicorn media_impact_monitor.api:app --reload`
Or, if necessary: `poetry run uvicorn media_impact_monitor.api:app --reload`
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from uvicorn.logging import AccessFormatter

from media_impact_monitor.events import get_events
from media_impact_monitor.impact import get_impact
from media_impact_monitor.trend import get_trend
from media_impact_monitor.types_ import (
    CountTimeSeries,
    Event,
    EventSearch,
    FulltextSearch,
    Impact,
    ImpactSearch,
    Response,
    TrendSearch,
)

metadata = dict(
    title="Media Impact Monitor API",
    version="0.1.2",
    contact=dict(
        name="Social Change Lab",
        url="https://github.com/socialchangelab/media-impact-monitor",
    ),
    redoc_url="/docs",
    # the original Swagger UI does not properly display POST parameters, so we disable it
    docs_url=None,
)


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    logger = logging.getLogger("uvicorn.access")
    if logger.handlers:
        console_formatter = AccessFormatter(
            "{asctime} {levelprefix} {message}", style="{", use_colors=True
        )
        logger.handlers[0].setFormatter(console_formatter)
    yield


app = FastAPI(**metadata, lifespan=app_lifespan)


# setup logging to also include datetime
@asynccontextmanager
async def app_lifespan(app: FastAPI):
    logger = logging.getLogger("uvicorn.access")
    if logger.handlers:
        console_formatter = AccessFormatter(
            "{asctime} {levelprefix} {message}", style="{", use_colors=True
        )
        logger.handlers[0].setFormatter(console_formatter)
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
    try:
        df = get_events(q)
        return Response(query=q, data=df.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{type(e).__name__}: {str(e)}")


@app.post("/trend")
def _get_trend(q: TrendSearch) -> Response[TrendSearch, CountTimeSeries]:
    """Fetch media item counts from the Media Impact Monitor database."""
    try:
        df = get_trend(q)
        return Response(query=q, data=df.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{type(e).__name__}: {str(e)}")


@app.post("/fulltexts")
def _get_fulltexts(q: FulltextSearch) -> Response[FulltextSearch, list[Event]]:
    """Fetch fulltexts from the Media Impact Monitor database."""
    try:
        raise NotImplementedError
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{type(e).__name__}: {str(e)}")


@app.post("/impact")
def _get_impact(q: ImpactSearch) -> Response[ImpactSearch, Impact]:
    """Compute the impact of an event on a media trend."""
    try:
        impact = get_impact(q)
        return Response(query=q, data=impact)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{type(e).__name__}: {str(e)}")
