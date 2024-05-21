"""Cache functions."""

from time import sleep as _sleep

from joblib import Memory
from requests import get as _get
from requests import post as _post
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
    response.raise_for_status()
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


concurrency = 10
retries = 2


@cache
def get_proxied(url, *args, **kwargs):
    client = ZenRowsClient(ZENROWS_API_KEY, retries=retries, concurrency=concurrency)
    response = client.get(url, *args, **kwargs)
    if '{"code":' in response.text:
        raise ValueError(f"{url}: {response.text}")
    return response
