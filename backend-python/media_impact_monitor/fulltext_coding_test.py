import asyncio

import pytest

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
    assert result["topics"]["protests and activism"] >= 3  # Should be mostly or entirely about activism
    assert result["topics"]["scientific research"] <= 2  # Should not be very much about science
    assert result["activism_sentiment"] is not None
    assert result["policy_sentiment"] is not None


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
    assert results[0]["topics"]["protests and activism"] >= 3
    assert results[0]["activism_sentiment"] is not None

    # Check second text (policy)
    assert results[1]["topics"]["climate policy proposals"] >= 3
    assert results[1]["policy_sentiment"] is not None

    # Check third text (science)
    assert results[2]["topics"]["scientific research"] >= 3


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
    assert result["topics"]["protests and activism"] >= 2
    assert result["topics"]["climate policy proposals"] >= 3
    assert result["topics"]["urgency of climate action"] >= 3
    assert result["activism_sentiment"] is not None
    assert result["policy_sentiment"] is not None
