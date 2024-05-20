import json

import pandas as pd

from media_impact_monitor.data_loaders.protest.press_releases.last_generation.extract import (
    extract_press_releases,
)
from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.llm import completion
from media_impact_monitor.util.parallel import parallel_tqdm

system_prompt = "Code the press release according to the JSON schema. Stick to the date format: YYYY-MM-DD."

tools = [
    {
        "type": "function",
        "function": {
            "name": "code_press_release",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": ["string", "null"],
                        "$comment": "Date of the press release. You must stick to the date format: YYYY-MM-DD. If the date is not present in the press release, set this field to null.",
                    },
                    "event_type": {
                        "type": "string",
                        "enum": ["protest", "other"],
                    },
                    "size_text": {
                        "type": ["string", "null"],
                        "$comment": "Size of the protest, in text form. This must be a literal quote from the press release.",
                    },
                    "size_number": {
                        "type": ["number", "null"],
                        "$comment": "Size of the protest, as a number, as extracted from `size_text`.",
                    },
                },
                "required": [
                    "date",
                    "event_type",
                    "size_text",
                    "size_number",
                ],
            },
        },
    }
]


def code_press_release(text: str) -> float:
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text},
    ]
    response = completion(
        messages=messages,
        tools=tools,
        tool_choice={"type": "function", "function": {"name": "code_press_release"}},
        temperature=0.0,
    )
    return json.loads(response.choices[0].message.tool_calls[0].function.arguments)


@cache
def code_press_releases():
    press_releases = extract_press_releases()
    data = parallel_tqdm(code_press_release, press_releases["content"].tolist())
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df["description"] = press_releases["title"] + "\n\n" + press_releases["content"]
    df["organizers"] = ["Last Generation (Germany)" for _ in range(len(df))]
    df["source"] = (
        "Press releases by Last Generation (Germany); scraped from "
        + press_releases["url"]
    )
    df = df[(df["event_type"] == "protest") & (df["date"].notnull())]
    return df
