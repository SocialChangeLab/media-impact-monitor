"""Acquire ACLED credentials in memory; never memoize authentication on disk."""

import re
from math import isfinite
from threading import Lock
from time import monotonic

import requests

from media_impact_monitor.util.env import (
    ACLED_ACCESS_TOKEN,
    ACLED_EMAIL,
    ACLED_PASSWORD,
)

_token = ""
_expires_at = 0.0
_lock = Lock()


def _valid_token(token: object) -> bool:
    return (
        isinstance(token, str)
        and re.fullmatch(r"[A-Za-z0-9._~+/=-]+", token) is not None
    )


def _fetch_token_payload() -> dict:
    response = requests.post(
        "https://acleddata.com/oauth/token",
        timeout=30,
        data={
            "username": ACLED_EMAIL,
            "password": ACLED_PASSWORD,
            "grant_type": "password",
            "client_id": "acled",
            "scope": "authenticated",
        },
    )
    response.raise_for_status()
    return response.json()


def _request_token() -> tuple[str, float]:
    try:
        payload = _fetch_token_payload()
        token, lifetime = payload["access_token"], float(payload["expires_in"])
        if not _valid_token(token) or not isfinite(lifetime) or lifetime <= 0:
            raise ValueError("Invalid token response")
        return token, lifetime
    except (requests.RequestException, ValueError, KeyError, TypeError):
        raise RuntimeError(
            "ACLED authentication failed; check the configured credentials."
        ) from None


def _current_token(force_refresh: bool, rejected_authorization: str | None) -> str:
    global _token, _expires_at
    with _lock:
        rejected_current = rejected_authorization == f"Bearer {_token}"
        if (
            force_refresh
            or rejected_current
            or not _token
            or monotonic() >= _expires_at
        ):
            token, lifetime = _request_token()
            _token, _expires_at = (
                token,
                monotonic() + lifetime - min(60, lifetime * 0.1),
            )
        return _token


def authorization_headers(
    force_refresh: bool = False, rejected_authorization: str | None = None
) -> dict[str, str]:
    if ACLED_EMAIL or ACLED_PASSWORD:
        if not (ACLED_EMAIL and ACLED_PASSWORD):
            raise RuntimeError("Configure both ACLED_EMAIL and ACLED_PASSWORD.")
        token = _current_token(force_refresh, rejected_authorization)
    elif ACLED_ACCESS_TOKEN:
        token = ACLED_ACCESS_TOKEN
    else:
        raise RuntimeError("Configure ACLED_EMAIL and ACLED_PASSWORD.")
    if not _valid_token(token):
        raise RuntimeError("Invalid ACLED access token.")
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
