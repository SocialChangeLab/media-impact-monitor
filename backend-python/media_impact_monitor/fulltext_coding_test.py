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
    assert results[0]["activism"] >= 3
    assert results[0]["activism_sentiment"] is not None

    # Check second text (policy)
    assert results[1]["policy"] >= 3
    assert results[1]["policy_sentiment"] is not None

    # Check third text (science)
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
    assert result["activism"] >= 2
    assert result["policy"] >= 3
    assert result["science"] >= 2
    assert result["activism_sentiment"] is not None
    assert result["policy_sentiment"] is not None
