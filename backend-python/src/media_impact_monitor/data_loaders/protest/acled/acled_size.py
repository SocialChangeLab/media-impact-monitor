import re

from number_parser import parse_number


def get_size_text(acled_string: str) -> str | None:
    # match string parts like "crowd size=around 160"
    match = re.search(r"(crowd )?size=(.*)", acled_string)
    if match:
        size_specifier = match.group(2).strip()
        return size_specifier
    return None


def get_size_number(size_text: str) -> int | None:
    try:
        return int(size_text)
    except ValueError:
        pass
    try:
        return int(float(size_text))
    except ValueError:
        pass
    if str(size_text) in ["None", "na", "nan", "", "no report", "no reports"]:
        return None
    # remove comma from 500,000; 1,500; etc.
    size_text = re.sub(r"(\d+),(\d+)", r"\1\2", size_text)
    # match string parts like "between 100 and 200", "100-200", etc.
    # if there are multiple numbers, take the mean
    multi_match = re.search(r"(\d+)\D+(\d+)", size_text)
    if multi_match:
        return (int(multi_match.group(1)) + int(multi_match.group(2))) // 2
    # match string parts like "around 100", "100", etc.
    single_match = re.search(r"(\d+)", size_text)
    if single_match:
        return int(single_match.group(1))
    size_text = (
        size_text.removesuffix(" tractors")
        .removesuffix(" cars")
        .removesuffix(" bicycles")
        .removesuffix(" vehicles")
        .removesuffix(" people")
        .removesuffix(" of")
    )
    size_text = (
        size_text.removeprefix("around ")
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
    if size_text in [
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
    size_text = (
        size_text.removeprefix("several ")
        .removeprefix("a ")
        .removeprefix("few ")
        .removeprefix("couple ")
    )
    if size_text in ["dozens", "dozen", "big group", "large group"]:
        return 50
    if size_text in ["hundreds", "hundred"]:
        return 500
    if size_text in ["thousands", "thousand"]:
        return 5000
    if size_text in ["tens of thousands"]:
        return 50_000
    if size_text in ["hundreds of thousands"]:
        return 500_000
    if size_text.endswith("dozen"):
        num_dozens = parse_number(size_text[:-6])
        if num_dozens:
            return num_dozens * 12
    parsed = parse_number(size_text)
    return parsed or None
