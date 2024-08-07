import asyncio
import json

import backoff
import json_repair
from aiolimiter import AsyncLimiter
from litellm import BadRequestError
from litellm.exceptions import RateLimitError as RateLimitError1
from tqdm.asyncio import tqdm_asyncio
from openai import RateLimitError as RateLimitError2
from media_impact_monitor.util.cache import cache

from media_impact_monitor.util.llm import acompletion, completion

system_prompt = """You are an assistant professor in political science at Stanford University. You have great expertise and intuition on the topics of climate change, activism, policy, and science. You can argue in a very open-ended manner and come to sharp conclusions. Your writing style is super concise and super down-to-earth.

You are given a text from a newspaper source and are asked to code it according to the criteria in the "code_text" function. You provide your answer in the expected JSON format, and are extra diligent to make sure that the format is correct, and that the answers are reliable and well-argued."""

tools = [
    {
        "type": "function",
        "function": {
            "name": "code_text",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "topics_reasoning": {
                        "type": "string",
                        "description": "The reasoning for the choice of topics (1-3 sentences)",
                    },
                    "topics": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "description": "A very concise free-text topic descriptor of 1-3 words, e.g. 'international relations', 'energy policy', 'olaf scholz', 'biodiversity', 'ukraine war', ...",
                        },
                        "description": "A list of the 10 most dominant topics in the text",
                    },
                    "activism_reasoning": {
                        "type": "string",
                        "description": "The reasoning for the activism extent (1 sentence)",
                    },
                    "activism": {
                        "type": "number",
                        "enum": [0, 1, 2, 3, 4],
                        "description": "To what extent is the text about activism? 0: not at all, 1: a little, 2: somewhat, 3: mostly, 4: entirely",
                    },
                    "activism_sentiment_reasoning": {
                        "type": ["string", "null"],
                        "description": "The reasoning for the activism sentiment (1-2 sentences). If the text is not about activism, this field should be null.",
                    },
                    "activism_sentiment": {
                        "type": ["number", "null"],
                        "enum": [-1, 0, 1],
                        "description": "What sentiment does the text have towards the activists/protester? -1: negative, 0: neutral, 1: positive. If the text is not about activism, this field should be null.",
                    },
                    "policy_reasoning": {
                        "type": "string",
                        "description": "The reasoning for the policy extent (1 sentence)",
                    },
                    "policy": {
                        "type": "number",
                        "enum": [0, 1, 2, 3, 4],
                        "description": "To what extent is the text about policy? 0: not at all, 1: a little, 2: somewhat, 3: mostly, 4: entirely",
                    },
                    "policy_sentiment_reasoning": {
                        "type": ["string", "null"],
                        "description": "The reasoning for the policy sentiment (1-5 sentences). If the text is not about policy, this field should be null.",
                    },
                    "policy_sentiment": {
                        "type": ["number", "null"],
                        "enum": [-1, 0, 1],
                        "description": "Does the text point out the insufficiency of existing policies and support progressive policy changes? -1: it supports the status quo or suggests regressive policy changes, 0: neutral, 1: it points out the insufficiency of existing policies or supports progressive policy changes. If the text is not about policy, this field should be null.",
                    },
                    "science_reasoning": {
                        "type": "string",
                        "description": "The reasoning for the science extent (1 sentence)",
                    },
                    "science": {
                        "type": "number",
                        "enum": [0, 1, 2, 3, 4],
                        "description": "To what extent is the text about natural phenomena or scientific research? 0: not at all, 1: a little, 2: somewhat, 3: mostly, 4: entirely",
                    },
                },
                "required": [
                    "topics_reasoning",
                    "topics",
                    "activism_reasoning",
                    "activism",
                    "activism_sentiment_reasoning",
                    "activism_sentiment",
                    "policy_reasoning",
                    "policy",
                    "policy_sentiment_reasoning",
                    "policy_sentiment",
                    "science_reasoning",
                    "science",
                ],
            },
        },
    }
]


rate_limit = AsyncLimiter(max_rate=1000, time_period=60)


# @cache
# @backoff.on_exception(backoff.expo, [RateLimitError1, RateLimitError2], max_time=120)
async def code_fulltext(text: str) -> dict | None:
    if len(text) < 50:
        return None
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text},
    ]
    try:
        async with rate_limit:
            response = await acompletion(
                messages=messages,
                tools=tools,
                tool_choice={"type": "function", "function": {"name": "code_text"}},
                temperature=0.0,
                max_tokens=4000,
            )
    except BadRequestError as e:
        print("Error while coding the text with AI:", e)
        return
    try:
        result = response.choices[0].message.tool_calls[0].function.arguments
        data = json_repair.repair_json(result, return_objects=True)
        for topic in ["activism", "policy"]:
            data[topic] = (
                int(data[topic]) if topic in data and data[topic] is not None else None
            )
            sent = f"{topic}_sentiment"
            data[sent] = (
                int(data[sent]) if sent in data and data[sent] is not None else None
            )
        return data
    except (json.JSONDecodeError, AssertionError):
        print(
            f'Error parsing the JSON code by the AI. Text: "{text[:50]+" ..."}", Response: {result}'
        )
        return


async def code_many_fulltexts_async(texts: list[str]) -> list[dict | None]:
    acompletions = [code_fulltext(text) for text in texts]
    label = "Coding sentiment of fulltexts with AI"
    completions = await tqdm_asyncio.gather(*acompletions, desc=f"{label:<{40}}")
    return completions


def code_many_fulltexts(texts: list[str]) -> list[dict | None]:
    return asyncio.run(code_many_fulltexts_async(texts))


def get_aspect_sentiment(text: str, aspect: str) -> float:
    """aspect-based sentiment analysis (ABSA) - see Wang et al. (2024)
    TODO: needs more extensive validation"""
    assert aspect in [
        "protest",
        "climate change",
        "climate policy",
        "politicians",
        "protesters' demands",
        "protesters' protest actions",
    ], f"Aspect {aspect} is currently not supported"

    user_prompt = f"What is the sentiment towards the aspect '{aspect}' in this text? Text: {text}"
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    try:
        response = completion(
            messages=messages,
            tools=tools,
            tool_choice={"type": "function", "function": {"name": "score_sentiment"}},
            temperature=0.0,
        )
    except BadRequestError as e:
        print(e)
        print(text)
        print(response)
        return
    return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
