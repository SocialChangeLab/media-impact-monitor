"""Cache functions."""

from time import sleep as _sleep

from joblib import Memory
from requests import Response
from requests import get as _get
from requests import post as _post

memory = Memory("cache", verbose=0)
cache = memory.cache


@cache(ignore=["sleep"])
def get(url, sleep=None, **kwargs) -> Response | None:
    r"""Send a GET request, cached in the cloud.

    :param url: URL for the new :class:`Request` object.
    :param params: (optional) Dictionary, list of tuples or bytes to send
        in the query string for the :class:`Request`.
    :param sleep: (optional) Number of seconds to sleep after the request.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """
    try:
        response = _get(url, **kwargs)
    except Exception:
        return None
    if sleep is not None:
        _sleep(sleep)
    return response


@cache(ignore=["sleep"])
def post(url, sleep=None, **kwargs) -> Response | None:
    r"""Send a POST request, cached in the cloud.

    :param url: URL for the new :class:`Request` object.
    :param params: (optional) Dictionary, list of tuples or bytes to send
        in the query string for the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :param sleep: (optional) Number of seconds to sleep after the request.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """
    try:
        response = _post(url, **kwargs)
    except Exception:
        return None
    if sleep is not None:
        _sleep(sleep)
    return response
