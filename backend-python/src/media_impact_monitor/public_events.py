"""Uncached publication boundary: never expose ACLED's individual event records."""

import json
from dataclasses import fields
from datetime import date
from hashlib import sha256
from math import isfinite
from typing import Literal

import pandas as pd
from pydantic import BaseModel, ConfigDict, Field

from media_impact_monitor.types_ import Event, EventSearch


class AcledEventSummary(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    summary_id: str
    source: Literal["acled"] = "acled"
    date: date
    organizers: list[str]
    size_number: float | None = Field(ge=0)
    event_count: int = Field(ge=1)
    unknown_size_count: int = Field(ge=0)


def _prepare_acled(frame: pd.DataFrame) -> pd.DataFrame:
    if not frame["source"].eq("acled").all():
        raise ValueError("Unexpected event source")
    safe = frame[["date", "organizers", "size_number"]].copy()
    safe["date"] = pd.to_datetime(safe["date"], errors="raise").dt.date
    if safe["date"].isna().any():
        raise ValueError("Missing protest date")
    safe["size_number"] = pd.to_numeric(safe["size_number"], errors="raise")
    known = safe["size_number"].dropna()
    if known.lt(0).any() or not known.map(isfinite).all():
        raise ValueError("Invalid protest size")
    safe["organizers"] = safe["organizers"].apply(
        lambda names: tuple(sorted(set(names)))
    )
    return safe


def _summarize_bucket(day: date, organizers: tuple, group: pd.DataFrame) -> dict:
    bucket = json.dumps([day.isoformat(), organizers], ensure_ascii=False)
    total = group["size_number"].sum(min_count=1)
    summary = AcledEventSummary(
        summary_id="acled-summary-" + sha256(bucket.encode()).hexdigest()[:24],
        date=day,
        organizers=list(organizers),
        size_number=None if pd.isna(total) else total,
        event_count=len(group),
        unknown_size_count=int(group["size_number"].isna().sum()),
    )
    return summary.model_dump(mode="json")


def _summarize_acled(frame: pd.DataFrame) -> list[dict]:
    safe = _prepare_acled(frame)
    summaries = [
        _summarize_bucket(day, organizers, group)
        for (day, organizers), group in safe.groupby(["date", "organizers"], sort=True)
    ]
    if sum(row["event_count"] for row in summaries) != len(frame):
        raise ValueError("Protest summary count mismatch")
    return summaries


def publish_events(query: EventSearch, frame: pd.DataFrame | None) -> list[dict]:
    """Always project after cache retrieval, including pre-restriction cache entries."""
    if frame is None or frame.empty:
        return []
    if query.source == "acled":
        return _summarize_acled(frame)
    if not frame["source"].eq("press_releases").all():
        raise ValueError("Unexpected event source")
    columns = [field.name for field in fields(Event)]
    return json.loads(frame[columns].to_json(orient="records", date_format="iso"))
