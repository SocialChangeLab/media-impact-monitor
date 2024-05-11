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
    source: EventSource = Field(
        description="The source dataset to search. Currently only ACLED is supported."
    )
    topic: Topic | None = Field(
        default=None,
        description="Filter by topic. This will automatically set filters for query and organizers, which you can further refine with the `query` field. Currently only _Climate Change_ is supported.",
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
    chart_position: float | None = Field("Index of protest on given day.")


#### Trend types ####

TrendType = Literal["keywords", "topics", "sentiments"]


class TrendSearch(BaseModel):
    trend_type: TrendType = Field(
        description="What type of trend to obtain: the frequency of a keyword, the value of a sentiment, or the frequencies of multiple sub-topics. Depending on the type, you have further configuration options. Currently only keyword frequencies are supported."
    )
    media_source: MediaSource = Field(
        description="The data source for the media data, i. e. online news, print news, parliamentary speech, etc."
    )
    topic: Topic | None = Field(
        description="When retrieving keyword frequencies, this automatically sets relevant sets of keywords. Currently only _climate_change_ is supported."
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


Method = Literal["synthetic_control", "interrupted_time_series"]


class ImpactSearch(BaseModel):
    cause: list[EventId] = Field(
        description="List of `event_id`s for events whose impact should be estimated. The ids can be obtained from the `/events/` endpoint."
    )
    effect: TrendSearch = Field(
        description="The trend on which the impact should be estimated. See the `/trends/` endpoint for details."
    )
    method: Method = Field(
        description="The causal inference method to use for estimating the impact. Currently supports _Synthetic Control_ and _Interrupted Time Series_."
    )


class MeanWithUncertainty(BaseModel):
    mean: float
    ci_upper: float
    ci_lower: float


AbstractTimeSeriesWithUncertainty = dict[int, MeanWithUncertainty]


class Impact(BaseModel):
    method_applicability: Literal["no", "maybe"] = Field(
        description="Whether the causal inference method is applicable for the given data."
    )
    method_applicability_reason: str | None = Field(
        description="Reason why the causal inference method is (not) applicable."
    )
    time_series: AbstractTimeSeriesWithUncertainty
    # = Field(
    #     description="Impact estimates for each day around the average protest event. Consists of 3 dictinonaries, each one containing a time series -- mean, upper bound, and lower bound of the two-sided 95% confidence interval. The time series are dictionaries of days after event (0 = day of event) and impact estimates for the given days."
    # )
