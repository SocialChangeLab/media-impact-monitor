import pytest
import asyncio
from media_impact_monitor.fulltext_coding import (
    code_fulltext,
    code_many_fulltexts,
    get_aspect_sentiment,
)


@pytest.mark.asyncio
async def test_code_fulltext():
    text = "Climate protesters demand immediate action on global warming."
    result = await code_fulltext(text)
    assert result is not None
    assert "climate" in " ".join(result["topics"]).lower()
    assert "protest" in " ".join(result["topics"]).lower()
    assert result["activism"] >= 3  # Should be mostly or entirely about activism
    assert result["policy"] >= 2  # Should be at least somewhat about policy
    assert result["science"] <= 2  # Should not be very much about science
    assert result["activism_sentiment"] is not None
    assert result["policy_sentiment"] is not None
    assert "demand" in result["activism_reasoning"].lower()
    assert "action" in result["policy_reasoning"].lower()
    assert len(result["topics"]) <= 10  # Should not exceed 10 topics


@pytest.mark.asyncio
async def test_code_fulltext_empty_text():
    result = await code_fulltext("")
    assert result is None


@pytest.mark.asyncio
async def test_code_fulltext_short_text():
    result = await code_fulltext("Short text.")
    assert result is None


def test_code_many_fulltexts():
    texts = [
        "Climate protest at city hall.",
        "New environmental policy announced.",
        "Scientists publish climate change study.",
    ]
    results = code_many_fulltexts(texts)
    assert len(results) == 3

    # Check first text (protest)
    assert "protest" in " ".join(results[0]["topics"]).lower()
    assert results[0]["activism"] >= 3
    assert results[0]["activism_sentiment"] is not None

    # Check second text (policy)
    assert "policy" in " ".join(results[1]["topics"]).lower()
    assert results[1]["policy"] >= 3
    assert results[1]["policy_sentiment"] is not None

    # Check third text (science)
    assert (
        "study" in " ".join(results[2]["topics"]).lower()
        or "science" in " ".join(results[2]["topics"]).lower()
    )
    assert results[2]["science"] >= 3


@pytest.mark.asyncio
async def test_code_fulltext_complex_text():
    text = """
    The latest IPCC report highlights the urgent need for climate action. 
    In response, environmental activists organized a series of protests 
    across major cities, demanding stricter emissions regulations. 
    Meanwhile, policymakers are debating a new carbon tax proposal, 
    which has received mixed reactions from industry leaders and economists.
    """
    result = await code_fulltext(text)
    assert result is not None
    assert all(
        topic in result["topics"]
        for topic in [
            "IPCC report",
            "climate action",
            "protests",
            "emissions regulations",
            "carbon tax",
        ]
    )
    assert result["activism"] >= 2
    assert result["policy"] >= 3
    assert result["science"] >= 2
    assert result["activism_sentiment"] is not None
    assert result["policy_sentiment"] is not None
    assert result["science_sentiment"] is not None


@pytest.mark.asyncio
async def test_rate_limiting():
    texts = ["Climate text " + str(i) for i in range(5)]
    start_time = asyncio.get_event_loop().time()
    await asyncio.gather(*[code_fulltext(text) for text in texts])
    end_time = asyncio.get_event_loop().time()
    duration = end_time - start_time
    assert duration >= 0.25, "Rate limiting should prevent too rapid requests"


def test_get_aspect_sentiment():
    text = "The climate protest was peaceful and raised important awareness."
    result = get_aspect_sentiment(text, "protest")
    assert isinstance(result, dict)
    assert "sentiment" in result
    assert isinstance(result["sentiment"], (int, float))
    assert result["sentiment"] > 0  # Should be positive sentiment


def test_get_aspect_sentiment_negative():
    text = "The climate policy changes are insufficient and disappointing."
    result = get_aspect_sentiment(text, "climate policy")
    assert isinstance(result, dict)
    assert "sentiment" in result
    assert isinstance(result["sentiment"], (int, float))
    assert result["sentiment"] < 0  # Should be negative sentiment


def test_get_aspect_sentiment_invalid_aspect():
    with pytest.raises(AssertionError):
        get_aspect_sentiment("Some text", "invalid_aspect")


@pytest.mark.asyncio
async def test_code_fulltext_error_handling():
    # Simulate a BadRequestError
    from unittest.mock import patch
    from litellm import BadRequestError

    with patch(
        "media_impact_monitor.fulltext_coding.acompletion",
        side_effect=BadRequestError("Test error"),
    ):
        result = await code_fulltext("Some text that would cause an error")
        assert result is None


if __name__ == "__main__":
    pytest.main(["-v"])
