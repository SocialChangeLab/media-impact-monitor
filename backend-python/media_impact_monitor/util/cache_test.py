import pytest
from media_impact_monitor.util.cache import get, get_proxied, post

# URLs for the stable testing endpoints (preferably dedicated for testing purposes)
GET_URL = "https://httpbin.org/get"
POST_URL = "https://httpbin.org/post"

# Test data for the POST request
POST_DATA = {"key": "value"}


def test_get_retrieval():
    """
    Test if the `get` function can successfully retrieve content.
    """
    response = get(GET_URL)
    assert response.status_code == 200
    assert (
        "args" in response.json()
    ), "The response should contain 'args' to confirm it's from httpbin.org"


def test_post_retrieval():
    """
    Test if the `post` function can successfully retrieve content.
    """
    response = post(POST_URL, json=POST_DATA)
    assert response.status_code == 200
    assert (
        response.json().get("json") == POST_DATA
    ), "The response body should contain the JSON data we sent"


@pytest.mark.skip(
    reason="Our API key has expired, we will get a new one once we really need it."
)
def test_get_proxied():
    """
    Test if the `get_proxied` function can successfully retrieve content.
    """
    response = get_proxied(GET_URL)
    assert response.status_code == 200
    assert (
        "args" in response.json()
    ), "The response should contain 'args' to confirm it's from httpbin.org"
