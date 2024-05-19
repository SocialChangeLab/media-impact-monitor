import json

from litellm import BadRequestError

from media_impact_monitor.util.llm import completion

system_prompt = "You're a sentiment analysis tool. For a given user input, always return the sentiment of the input. Return -1 for negative, 0 for neutral, and 1 for positive. Before you make your decision, reason about the decision."

tools = [
    {
        "type": "function",
        "function": {
            "name": "score_sentiment",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "reasoning": {
                        "type": "string",
                        "description": "The reasoning for the sentiment",
                    },
                    "sentiment": {
                        "type": "number",
                        "description": "The sentiment: -1 for negative, 0 for neutral, 1 for positive",
                    },
                },
                "required": ["reasoning", "sentiment"],
            },
        },
    }
]


def sentiment(text: str) -> float:
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
        )
    except BadRequestError as e:
        print(e)
        print(text)
        print(response)
        return
    return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
