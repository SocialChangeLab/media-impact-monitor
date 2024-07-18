import datetime
from dataclasses import dataclass
from datetime import date
from typing import Generic, Literal, Optional, TypeVar

from pydantic import BaseModel, Field

#### General types ####

# FIXME: consider renaming "Topic" to "Issue" to avoid confusion with topics within the issue (like science or policy)
Topic = Literal["climate_change"]
Query = str  # for now, just a single keyword
MediaSource = Literal["news_online", "news_print", "web_google"]

StartDateField = Field(
    default=None,
    description="Filter by start date. By default, the earliest date available is used.",
)
EndDateField = Field(
    default=None,
    description="Filter by end date. By default, the latest date available is used.",
)

#### API types ####

Q = TypeVar("Q")
R = TypeVar("R")


class Response(BaseModel, Generic[Q, R]):
    query: Q
    data: R


#### Event types ####

EventType = str
EventSource = Literal["acled", "press_releases"]
EventId = str


class EventSearch(BaseModel):
    source: EventSource = Field(
        description="The source dataset to search. Currently only ACLED is supported."
    )
    topic: Topic | None = Field(
        default=None,
        description="Filter by topic. This will automatically set filters for query and organizers, which you can further refine with the `query` field. Currently only _climate_change_ is supported.",
    )
    start_date: date | None = StartDateField
    end_date: date | None = EndDateField
    organizers: list[str] | None = Field(
        default=None, description="Filter by the organizations involved in the event."
    )


date_ = date


@dataclass
class Event:
    event_id: EventId = Field(description="Unique identifier for the event.")
    event_type: EventType = Field(description="The type of event.")
    source: str = Field(description="The source dataset.")
    date: date_ = Field(description="The date of the event.")
    country: str | None = Field(description="The country where the event took place.")
    region: str | None = Field(description="The region where the event took place.")
    city: str | None = Field(description="The city where the event took place.")
    organizers: list[str] = Field(
        description="The organizations involved in the event."
    )
    size_text: str | None = Field(description="Size of the event, in words.")
    size_number: int | None = Field(
        description="Size of the event, quantified if possible."
    )
    description: str = Field(description="Description of the event.")


#### Trend types ####

TrendType = Literal["keywords", "topic", "sentiment"]
Aggregation = Literal["daily", "weekly", "monthly"]


class TrendSearch(BaseModel):
    trend_type: TrendType = Field(
        description="What type of trend to obtain: the frequency of a keyword, the value of a sentiment, or the frequencies of multiple sub-topics. Depending on the type, you have further configuration options. Currently only keyword frequencies are supported."
    )
    media_source: MediaSource = Field(
        description="The data source for the media data (i.e., online news, print news, etc.)."
    )
    start_date: date | None = StartDateField
    end_date: date | None = EndDateField
    topic: Topic | None = Field(
        description="When retrieving keyword frequencies, this automatically sets relevant sets of keywords. Currently only _climate_change_ is supported."
    )
    aggregation: Aggregation = Field(
        default="daily", description="The time aggregation of the trend."
    )
    query: Query | None = Field(default=None, description="Custom query.")
    organizers: list[str] | None = Field(
        default=None, description="The organizations involved in the event."
    )
    event_ids: list[EventId] | None = Field(
        default=None,
        description="The ids of the protest events that the trend should be related to.",
    )  # TODO: this is not compatible with "keyword"


class CategoryCount(BaseModel):
    date: date
    topic: str
    n_articles: int


#### Policy types ####

PolicyLevel = Literal["Germany", "EU"]
PolicyType = Literal[
    "Gesetzgebung", "Petition", "Kleine Anfrage", "Bericht, Gutachten, Programm"
]


class PolicySearch(BaseModel):
    policy_level: PolicyLevel = Field(
        default="Germany",
        description="Data from which policy level to obtain. German national policy or EU legislation.",
    )
    policy_type: PolicyType | None = Field(
        default="Gesetzgebung",
        description="What type of policy to obtain (currently only relevant for German national policies, `policy_level` = 'Germany')",
    )
    start_date: date | None = StartDateField
    end_date: date | None = EndDateField
    # institution: # defaults to "BT" for now
    topic: Topic | None = Field(
        None,
        description="What policy topic to filter for. Currently only 'climate_change'.",
    )


# @dataclass
# class Policy(BaseModel):
#     id: str
#     datum: datetime.datetime
#     aktualisiert: datetime.datetime
#     vorgangstyp: str
#     titel: str
#     abstract: str
#     initiative: list[str]
#     sachgebiet: list[str]
#     beratungsstand: str


#### Fulltext types ####


class FulltextSearch(BaseModel):
    """
    You can set parameters for media_source and date_range, and filter by one of the following: topic, organizers, query, or event_id. For now you cannot combine the latter filters, since they all affect the query in different ways.
    """

    media_source: MediaSource = Field(
        description="The data source for the media data (i.e., online news, print news, etc.)."
    )
    start_date: date | None = StartDateField
    end_date: date | None = EndDateField
    topic: Topic | None = Field(
        default=None,
        description="This automatically picks a relevant set of keywords. Currently only _climate_change_ is supported.",
    )
    query: Query | None = Field(default=None, description="Custom query.")
    organizers: list[str] | None = Field(
        default=None, description="The organizations involved in the event."
    )
    event_id: EventId | None = Field(
        default=None,
        description="The id of the protest event that the fulltexts should be related to.",
    )


class Fulltext(BaseModel):
    title: str
    date: date
    url: str
    text: str
    sentiment: float | None


#### Impact types ####


Method = Literal[
    "interrupted_time_series", "synthetic_control", "time_series_regression"
]


class ImpactSearch(BaseModel):
    method: Method = Field(
        default="time_series_regression",
        description="The causal inference method to use for estimating the impact. Currently supports _time_series_regression_.",
    )
    impacted_trend: TrendSearch = Field(
        description="The trend on which the impact should be estimated. See the `/trends/` endpoint for details."
    )
    organizer: str | None = Field()
    # protest_type: str | None
    start_date: date | None = StartDateField
    end_date: date | None = EndDateField


class MeanWithUncertainty(BaseModel):
    mean: float = Field(description="Mean estimate.")
    ci_upper: float = Field(description="Upper bound of the 95% confidence interval.")
    ci_lower: float = Field(description="Lower bound of the 95% confidence interval.")


class DatedMeanWithUncertainty(BaseModel):
    date: int | date
    mean: float
    ci_upper: float
    ci_lower: float


class ImpactEstimate(BaseModel):
    absolute_impact: MeanWithUncertainty
    # relative_impact: MeanWithUncertainty
    absolute_impact_time_series: list[DatedMeanWithUncertainty]
    # relative_impact_time_series: list[DatedMeanWithUncertainty]


class Impact(BaseModel):
    method_applicability: bool
    method_limitations: list[str]
    impact_estimates: dict[str, ImpactEstimate] | None = Field(
        description='Impact estimates for each trend. The keys are the trend names -- e. g. "positive" / "neutral" / "negative" for sentiment trends, or "activism" / "science" / "policy" / ... for topic trends. The values are the impact estimates for each trend.'
    )


#### Organizations ####


class Organizer(BaseModel):
    organizer_id: str
    name: str
