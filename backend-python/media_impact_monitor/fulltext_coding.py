import json

import json_repair
from litellm import BadRequestError

from media_impact_monitor.util.llm import completion

system_prompt = """You're a sentiment analysis tool. For a given user input, always return the sentiment of the input. Return -1 for negative, 0 for neutral, and 1 for positive. Before you make your decision, reason about the decision. Stick exactly to the specified JSON schema including the "sentiment_reasoning" and "sentiment" fields."""

tools = [
    {
        "type": "function",
        "function": {
            "name": "score_sentiment",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "sentiment_reasoning": {
                        "type": "string",
                        "description": "The reasoning for the sentiment",
                    },
                    "sentiment": {
                        "type": "number",
                        "description": "The sentiment: -1 for negative, 0 for neutral, 1 for positive",
                    },
                },
                "required": ["sentiment_reasoning", "sentiment"],
            },
        },
    }
]


# classic trinary sentiment classification
def code_fulltext(text: str) -> float | None:
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text},
    ]
    try:
        response = completion(
            messages=messages,
            tools=tools,
            tool_choice={"type": "function", "function": {"name": "score_sentiment"}},
            temperature=0.0,
            max_tokens=1000,
        )
    except BadRequestError as e:
        print("error coding sentiment:", e)
        return
    try:
        result = response.choices[0].message.tool_calls[0].function.arguments
        data = json_repair.repair_json(result, return_objects=True)
        assert "sentiment_reasoning" in data and "sentiment" in data
        data["sentiment"] = int(data["sentiment"])
        return data
    except (json.JSONDecodeError, AssertionError):
        print(f"error coding sentiment. text: {text[:50]}, response: {result}")
        return


async def code_many_fulltexts_async(texts: list[str]) -> list[dict | None]:
    acompletions = [code_fulltext(text) for text in texts]
    completions = await tqdm_asyncio.gather(
        *acompletions, desc="Coding sentiment of fulltexts with AI"
    )
    completions = [
        completion["choices"][0]["message"]["content"] if completion else None
        for completion in completions
    ]
    completions = [
        json.loads(completion) if completion else None for completion in completions
    ]
    return completions


def code_many_fulltexts(texts: list[str]) -> list[dict | None]:
    return asyncio.run(code_many_fulltexts_async(texts))


def get_aspect_sentiment(text: str, aspect: str) -> float:
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
