from dataclasses import dataclass
from datetime import date
from typing import Literal

from pydantic import BaseModel

#### General types ####

Topic = Literal["climate_change"]
Query = str  # for now, just a single keyword
MediaSource = Literal["news_online", "news_print"]


#### Event types ####

EventType = Literal["protest"]
EventSource = Literal["acled"]
EventId = str


class EventSearch(BaseModel):
    event_type: EventType
    source: EventSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None
    organizations: list[str] | None = None


@dataclass
class Event:
    event_id: EventId
    event_type: EventType
    source: EventSource
    topic: Topic
    date: date
    organizations: list[str]
    description: str


#### Trend types ####

TrendType = Literal["keywords", "topics", "sentiments"]


class TrendSearch(BaseModel):
    trend_type: TrendType
    media_source: MediaSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None


class Count(BaseModel):
    date: date
    count: int


#### Fulltext types ####


class FulltextSearch(BaseModel):
    media_source: MediaSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None
    organizations: list[str] | None = None


class Fulltext(BaseModel):
    date: date
    title: str
    text: str


#### Impact types ####


Cause = list[EventId]


class Effect(BaseModel):
    trend_type: TrendType
    media_source: MediaSource
    topic: Topic | None = None
    query: Query | None = None
    # start_date, end_date can be derived from the EventIds


method = Literal["synthetic_control", "interrupted_time_series"]


class ImpactSearch(BaseModel):
    cause: Cause
    effect: Effect
    method: method


class Impact(BaseModel):
    method_applicability: Literal["no", "maybe"]
    method_applicability_reason: str | None
    impact_average: dict[
        int, float
    ]  # impact estimate for each day around the average protest event
    impact_average_upper: dict[int, float] | None
    impact_average_lower: dict[int, float] | None
