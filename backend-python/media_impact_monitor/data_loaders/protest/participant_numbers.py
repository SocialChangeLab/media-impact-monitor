import re

import pandas as pd
from number_parser import parse_number
from src.cache import cache
from src.paths import external_data


def get_size_v1(acled_string: str) -> int | None:
    # match string parts like "[size=around 160]"
    # as occurring in the German dataset
    match = re.search(r"\[size=(.*)\]", acled_string)
    if match:
        size_specifier = match.group(1).strip()
        return parse_number_string(size_specifier)
    return None


def get_size_v2(acled_string: str) -> int | None:
    # match string parts like "crowd size=around 160"
    # as occurring in the US dataset
    match = re.search(r"(crowd )?size=(.*)", acled_string)
    if match:
        size_specifier = match.group(2).strip()
        return parse_number_string(size_specifier)
    return None


def parse_number_string(s: str) -> int | None:
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return int(float(s))
    except ValueError:
        pass
    if str(s) in ["None", "na", "nan", "", "no report", "no reports"]:
        return None
    # remove comma from 500,000; 1,500; etc.
    s = re.sub(r"(\d+),(\d+)", r"\1\2", s)
    # match string parts like "between 100 and 200", "100-200", etc.
    # if there are multiple numbers, take the mean
    multi_match = re.search(r"(\d+)\D+(\d+)", s)
    if multi_match:
        return (int(multi_match.group(1)) + int(multi_match.group(2))) // 2
    # match string parts like "around 100", "100", etc.
    single_match = re.search(r"(\d+)", s)
    if single_match:
        return int(single_match.group(1))
    s = (
        s.removesuffix(" tractors")
        .removesuffix(" cars")
        .removesuffix(" bicycles")
        .removesuffix(" vehicles")
        .removesuffix(" people")
        .removesuffix(" of")
    )
    s = (
        s.removeprefix("around ")
        .removeprefix("about ")
        .removeprefix("approximately ")
        .removeprefix("at least ")
        .removeprefix("at most ")
        .removeprefix("up to ")
        .removeprefix("more than ")
        .removeprefix("over ")
        .removeprefix("less than ")
        .removeprefix("fewer than ")
        .removeprefix("under ")
        .removeprefix("nearly ")
    )
    if s in [
        "several",
        "a handful",
        "a few",
        "some",
        "a group",
        "a small group",
        "small group",
        "a couple",
        "half dozen",
        "half-dozen",
        "half a dozen",
    ]:
        return 5
    s = (
        s.removeprefix("several ")
        .removeprefix("a ")
        .removeprefix("few ")
        .removeprefix("couple ")
    )
    if s in ["dozens", "dozen", "big group", "large group"]:
        return 50
    if s in ["hundreds", "hundred"]:
        return 500
    if s in ["thousands", "thousand"]:
        return 5000
    if s in ["tens of thousands"]:
        return 50_000
    if s in ["hundreds of thousands"]:
        return 500_000
    if s.endswith("dozen"):
        num_dozens = parse_number(s[:-6])
        if num_dozens:
            return num_dozens * 12
    parsed = parse_number(s)
    if parsed:
        return parsed


def clean_city_name(city: str):
    # clean versions like "Berlin - Mitte", "Hamburg - Inner City", "Berlin - Berlin Mitte"
    return city.split(" - ")[0]


fn = "2020-01-01-2023-06-30-Europe-Austria-Germany-Switzerland.csv"


@cache
def load_acled_protests(
    all_columns=False, file=external_data / "acled" / fn
) -> pd.DataFrame:
    df = pd.read_csv(file, parse_dates=["event_date"])
    df = df[df["event_type"] == "Protests"]
    df = df.rename(
        columns={
            "region": "continent",
            "event_date": "date",
            "admin1": "region",
            "assoc_actor_1": "actor",
            "sub_event_type": "type",
        }
    )
    if not all_columns:
        df = df[
            [
                "date",
                "type",
                "actor",
                "country",
                "region",
                "location",
                "notes",
                "tags",
            ]
        ]
    df["region"] = df["region"].str.replace("Baden-Wurttemberg", "Baden-Württemberg")
    df["region"] = df["region"].str.replace("Thuringen", "Thüringen")
    df["size_pre"] = pd.NA
    if "tags" in df.columns:
        df["size_post"] = df["tags"].apply(get_size_v2)
        df = df.drop(columns=["tags"])
    else:
        df["size_post"] = df["notes"].apply(get_size_v1)
    df["location"] = df["location"].apply(clean_city_name)
    return df
