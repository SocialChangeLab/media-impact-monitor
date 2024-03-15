from dataclasses import dataclass
from typing import Literal

import pandas as pd


@dataclass
class Event:
    date: pd.Timestamp
    organization: str
    description: str


@dataclass
class EventJson:
    date: str
    organization: str
    description: str


@dataclass
class Count:
    date: pd.Timestamp
    count: int


@dataclass
class CountJson:
    date: str
    count: int


CountType = Literal["news_online", "news_print"]
