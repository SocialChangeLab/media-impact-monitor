import asyncio
import json
import json_repair
from aiolimiter import AsyncLimiter
from litellm import BadRequestError as BadRequestError1
from openai import BadRequestError as BadRequestError2
from tqdm.asyncio import tqdm_asyncio
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
                    # # the original free-text formulation for the topics:
                    # "topics": {
                    #     "type": "array",
                    #     "items": {
                    #         "type": "string",
                    #         "description": "A very concise free-text topic descriptor of 1-3 words, e.g. 'international relations', 'energy policy', 'olaf scholz', 'biodiversity', 'ukraine war', ...",
                    #     },
                    #     "description": "A list of the 10 most dominant topics in the text",
                    # },
                    "topics": {
                        "type": "object",
                        "description": "To what extent is the text about the following topics? 0: not at all, 1: a little, 2: somewhat, 3: mostly, 4: entirely",
                        "properties": {
                            "protests and activism": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                            "extreme weather and disasters": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                            "climate conferences and agreements": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                            "climate policy proposals": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                            "scientific research": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                            "urgency of climate action": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                            "social and international justice": {
                                "type": "number",
                                "enum": [0, 1, 2, 3, 4],
                            },
                        },
                        "required": [
                            "protests and activism",
                            "extreme weather and disasters",
                            "climate conferences and agreements",
                            "climate policy proposals",
                            "scientific research",
                            "urgency of climate action",
                            "social and international justice",
                        ],
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
                    "policy_sentiment_reasoning": {
                        "type": ["string", "null"],
                        "description": "The reasoning for the policy sentiment (1-5 sentences). If the text is not about policy, this field should be null.",
                    },
                    "policy_sentiment": {
                        "type": ["number", "null"],
                        "enum": [-1, 0, 1],
                        "description": "Does the text point out the insufficiency of existing policies and support progressive policy changes? -1: it supports the status quo or suggests regressive policy changes, 0: neutral, 1: it points out the insufficiency of existing policies or supports progressive policy changes. If the text is not about policy, this field should be null.",
                    },
                },
                "required": [
                    "topics_reasoning",
                    "topics",
                    "activism_sentiment_reasoning",
                    "activism_sentiment",
                    "policy_sentiment_reasoning",
                    "policy_sentiment",
                ],
            },
        },
    }
]


rate_limit = AsyncLimiter(max_rate=1000, time_period=60)


async def code_fulltext(text: str) -> dict | None:
    if len(text) < 20:
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
    except (BadRequestError1, BadRequestError2) as e:
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
        data["topics"] = data["topics"]
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
    except (BadRequestError1, BadRequestError2) as e:
        print(e)
        print(text)
        print(response)
        return
    return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
