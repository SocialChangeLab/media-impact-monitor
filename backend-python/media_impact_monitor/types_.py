from dataclasses import dataclass
from datetime import date
from typing import Literal

#### General types ####

Topic = Literal["climate_change"]
Query = str  # for now, just a single keyword
MediaSource = Literal["news_online", "news_print"]


#### Event types ####

EventType = Literal["protest"]
EventSource = Literal["acled"]
EventId = str


@dataclass
class EventSearch:
    event_type: EventType
    source: EventSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None
    organizations: list[str] | None = None


@dataclass
class Event:
    id: EventId
    event_type: EventType
    source: EventSource
    date: date
    organizations: list[str]
    topic: Topic
    description: str


#### Trend types ####

TrendType = Literal["keywords", "topics", "sentiments"]


@dataclass
class TrendSearch:
    trend_type: TrendType
    media_source: MediaSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None


@dataclass
class Count:
    date: date
    count: int


#### Fulltext types ####


@dataclass
class FulltextSearch:
    media_source: MediaSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None
    organizations: list[str] | None = None


@dataclass
class Fulltext:
    date: date
    title: str
    text: str


#### Impact types ####


Cause = list[EventId]


@dataclass
class Effect:
    trend_type: TrendType
    media_source: MediaSource
    topic: Topic | None = None
    query: Query | None = None
    # start_date, end_date can be derived from the EventIds


method = Literal["synthetic_control", "interrupted_time_series"]


@dataclass
class ImpactSearch:
    cause: Cause
    effect: Effect
    method: method


@dataclass
class Impact:
    method_applicability: Literal["no", "maybe"]
    method_applicability_reason: str | None
    impact_average: dict[
        int, float
    ]  # impact estimate for each day around the average protest event
    impact_average_upper: dict[int, float] | None
    impact_average_lower: dict[int, float] | None
