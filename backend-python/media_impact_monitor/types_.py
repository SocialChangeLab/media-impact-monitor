from dataclasses import dataclass
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field

#### General types ####

Topic = Literal["climate_change"]
Query = str  # for now, just a single keyword
MediaSource = Literal["news_online", "news_print"]


#### Event types ####

EventType = Literal["protest"]
EventSource = Literal["acled"]
EventId = str


class EventSearch(BaseModel):
    event_type: EventType = Field(
        description="The type of event to search. Currently only protests are supported."
    )
    source: EventSource = Field(
        description="The source dataset to search. Currently only ACLED is supported."
    )
    start_date: date = Field(
        description="The start date of the search, inclusive, in the format YYYY-MM-DD."
    )
    end_date: date = Field(
        description="The end date of the search, inclusive, in the format YYYY-MM-DD."
    )
    topic: Topic | None = Field(
        default=None,
        description="Filter by topic. This will automatically set filters for query and organizations, which you can further refine with the `query` and `organizations` fields. Currently only _Climate Change_ is supported.",
    )
    query: Query | None = Field(
        default=None,
        description="Filter by a keyword query that must occur in the event description or the organization names.",
    )
    organizations: list[str] | None = Field(
        default=None,
        description="Filter by organizations involved in the events.",
    )


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
    impact_average: dict[int, float] = Field(
        description="Impact estimate for each day around the average protest event."
    )
    impact_average_upper: dict[int, float] | None
    impact_average_lower: dict[int, float] | None
