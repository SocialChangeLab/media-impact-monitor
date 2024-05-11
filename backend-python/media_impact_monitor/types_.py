from dataclasses import dataclass
from datetime import date
from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, Field

#### General types ####

Topic = Literal["climate_change"]
Query = str  # for now, just a single keyword
MediaSource = Literal["news_online", "news_print", "web_google"]


CountTimeSeries = dict[date, int]  # time series with integer values
TimeSeries = dict[date, float]  # time series with float values
AbstractTimeSeries = dict[int, float]  # time series with float values and without dates

#### API types ####

Q = TypeVar("Q")
R = TypeVar("R")


class Response(BaseModel, Generic[Q, R]):
    query: Q
    data: R


#### Event types ####

EventType = str
EventSource = str
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
    organizers: list[str] | None = Field(
        default=None,
        description="Filter by organizers involved in the events.",
    )
    topic: Topic | None = Field(
        default=None,
        description="Filter by topic. This will automatically set filters for query and organizers, which you can further refine with the `query` field. Currently only _Climate Change_ is supported.",
    )
    query: Query | None = Field(
        default=None,
        description="Filter by a keyword query that must occur in the event description.",
    )


date_ = date


@dataclass
class Event:
    event_id: EventId = Field(description="Unique identifier for the event.")
    event_type: EventType = Field(description="The type of event.")
    source: EventSource = Field(description="The source dataset.")
    date: date_ = Field(description="The date of the event.")
    country: str = Field(description="The country where the event took place.")
    region: str = Field(description="The region where the event took place.")
    city: str = Field(description="The city where the event took place.")
    organizers: list[str] = Field(
        description="The organizations involved in the event."
    )
    size_text: str = Field(description="Size of the event, in words.")
    size_number: int | None = Field(
        description="Size of the event, quantified if possible."
    )
    description: str = Field(description="Description of the event.")


#### Trend types ####

TrendType = Literal["keywords", "topics", "sentiments"]


class TrendSearch(BaseModel):
    trend_type: TrendType = Field(
        description="What type of trend to obtain: the frequency of a keyword, the value of a sentiment, or the frequencies of multiple sub-topics. Depending on the type, you have further configuration options. Currently only keyword frequencies are supported."
    )
    media_source: MediaSource = Field(
        description="The data source for the media data, i. e. online news, print news, parliamentary speech, etc."
    )
    start_date: date = Field(
        description="The start date of the search, inclusive, in the format YYYY-MM-DD."
    )
    end_date: date = Field(
        description="The end date of the search, inclusive, in the format YYYY-MM-DD."
    )
    topic: Topic | None = Field(
        default=None,
        description="Filter by topic. Currently only _Climate Change_ is supported. This will automatically set a  filter for the query, which you can further refine with `query` field.",
    )
    query: Query | None = Field(
        default=None,
        description="Filter by a keyword query that must occur within a media item in order to be counted.",
    )


#### Fulltext types ####


class FulltextSearch(BaseModel):
    media_source: MediaSource
    start_date: date
    end_date: date
    topic: Topic | None = None
    query: Query | None = None
    organizers: list[str] | None = None


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


Method = Literal["synthetic_control", "interrupted_time_series"]


class ImpactSearch(BaseModel):
    cause: Cause = Field(
        description="List of `event_id`s for events whose impact should be estimated. The ids can be obtained from the `/events/` endpoint."
    )
    effect: Effect = Field(
        description="The trend on which the impact should be estimated. See the `/trends/` endpoint for details."
    )
    method: Method = Field(
        description="The causal inference method to use for estimating the impact. Currently supports _Synthetic Control_ and _Interrupted Time Series_."
    )


class Impact(BaseModel):
    method_applicability: Literal["no", "maybe"] = Field(
        description="Whether the causal inference method is applicable for the given data."
    )
    method_applicability_reason: str | None = Field(
        description="Reason why the causal inference method is (not) applicable."
    )
    impact_mean: AbstractTimeSeries = Field(
        description="Impact estimate for each day around the average protest event. Dictionary of days after event (0 = day of event) and impact estimates for the given days."
    )
    impact_mean_upper: AbstractTimeSeries | None = Field(
        description="Upper bound of the two-sided 95% confidence interval for the impact estimate, for each day around the average protest event. Dictionary of days after event (0 = day of event) and impact estimates for the given days."
    )
    impact_mean_lower: AbstractTimeSeries | None = Field(
        description="Lower bound of the two-sided 95% confidence interval for the impact estimate, for each day around the average protest event. Dictionary of days after event (0 = day of event) and impact estimates for the given days."
    )
    individual_impacts: dict[EventId, TimeSeries] | None = Field(
        description="Impact estimate for each individual protest event, respectively for each day around the event. Dictionary of event_ids and time series. Each time series in turn is a dictionary of dates and impact estimates for the given dates."
    )
