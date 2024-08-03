"""Cache functions."""

import asyncio
from time import sleep as _sleep

from joblib import Memory
from requests import get as _get
from requests import post as _post
from tqdm.asyncio import tqdm_asyncio
from zenrows import ZenRowsClient

from media_impact_monitor.util.env import ZENROWS_API_KEY

memory = Memory("cache", verbose=0)
cache = memory.cache


@cache(ignore=["sleep"])
def get(url, sleep=None, **kwargs):
    r"""Send a GET request, cached in the cloud.

    :param url: URL for the new :class:`Request` object.
    :param params: (optional) Dictionary, list of tuples or bytes to send
        in the query string for the :class:`Request`.
    :param sleep: (optional) Number of seconds to sleep after the request.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """
    response = _get(url, **kwargs)
    if sleep is not None:
        _sleep(sleep)
    return response


@cache(ignore=["sleep"])
def post(url, sleep=None, **kwargs):
    r"""Send a POST request, cached in the cloud.

    :param url: URL for the new :class:`Request` object.
    :param params: (optional) Dictionary, list of tuples or bytes to send
        in the query string for the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :param sleep: (optional) Number of seconds to sleep after the request.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """
    response = _post(url, **kwargs)
    response.raise_for_status()
    if sleep is not None:
        _sleep(sleep)
    return response


@cache
def get_proxied(url, **kwargs):
    if "timeout" not in kwargs:
        kwargs["timeout"] = 10
    try:
        response = get(url, **kwargs)
        return response
    except Exception:
        pass
    client = ZenRowsClient(ZENROWS_API_KEY, retries=2, concurrency=10)
    response = client.get(url, **kwargs)
    if response.text.startswith('{"code":'):
        zenrows_errors = [
            "REQS001",
            "REQS004",
            "REQS006",
            "RESP004",
            "AUTH001",
            "AUTH002",
            "AUTH003",
            "AUTH004",
            "AUTH005",
            "AUTH009",
            "BLK0001",
            "AUTH007",
            "AUTH006",
            "AUTH008",
            "CTX0001",
            "ERR0001",
            "ERR0000",
            "RESP003",
        ]
        if any(error in response.text for error in zenrows_errors):
            # problem with zenrows -> inform the developer
            raise Exception(response.text)
        # otherwise, problem with the site itself -> just don't use this site
        return None
    return response
