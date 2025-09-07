import asyncio
import json
import json_repair
from aiolimiter import AsyncLimiter
from litellm import BadRequestError as BadRequestError1
from openai import BadRequestError as BadRequestError2
from tqdm.asyncio import tqdm_asyncio
from media_impact_monitor.util.cache import cache

from media_impact_monitor.util.llm import acompletion, completion
from media_impact_monitor.types_ import Topic

system_prompt = """You are an assistant professor in political science at Stanford University. You have great expertise and intuition on the topics of climate change, activism, policy, and science. You can argue in a very open-ended manner and come to sharp conclusions. Your writing style is super concise and super down-to-earth.

You are given a text from a newspaper source and are asked to code it according to the criteria in the "code_text" function. You provide your answer in the expected JSON format, and are extra diligent to make sure that the format is correct, and that the answers are reliable and well-argued."""

def get_policy_sentiment_description(topic: Topic | None) -> str:
    """Get topic-specific policy sentiment description."""
    if topic == "gaza_crisis":
        return "Does the text support war actions by Hamas or the Israeli government vs supporting peace and humanitarian action? -1: it supports war actions by Hamas or Israeli government, 0: neutral, 1: it supports peace and humanitarian action. If the text is not about policy, this field should be null."
    else:  # climate_change or None (default to climate)
        return "Does the text point out the insufficiency of existing policies and support progressive policy changes? -1: it supports the status quo or suggests regressive policy changes, 0: neutral, 1: it points out the insufficiency of existing policies or supports progressive policy changes. If the text is not about policy, this field should be null."

def get_tools(topic: Topic | None) -> list[dict]:
    """Get topic-specific tools for coding."""
    return [
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
                            "description": get_policy_sentiment_description(topic),
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


async def code_fulltext(text: str, topic: Topic | None = None) -> dict | None:
    if len(text) < 20:
        return None
    
    tools = get_tools(topic)
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
        for topic_key in ["activism", "policy"]:
            data[topic_key] = (
                int(data[topic_key]) if topic_key in data and data[topic_key] is not None else None
            )
            sent = f"{topic_key}_sentiment"
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


async def code_many_fulltexts_async(texts: list[str], topic: Topic | None = None) -> list[dict | None]:
    acompletions = [code_fulltext(text, topic) for text in texts]
    label = "Coding sentiment of fulltexts with AI"
    completions = await tqdm_asyncio.gather(*acompletions, desc=f"{label:<{40}}")
    return completions


def code_many_fulltexts(texts: list[str], topic: Topic | None = None) -> list[dict | None]:
    return asyncio.run(code_many_fulltexts_async(texts, topic))


def get_aspect_sentiment(text: str, aspect: str, topic: Topic | None = None) -> float:
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
    tools = get_tools(topic)
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
