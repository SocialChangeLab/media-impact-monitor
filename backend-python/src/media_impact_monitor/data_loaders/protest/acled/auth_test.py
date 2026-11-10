"""OAuth tests use synthetic credentials and responses; never contact ACLED."""

from unittest.mock import Mock

import pytest
import requests

from media_impact_monitor.data_loaders.protest.acled import auth


@pytest.fixture(autouse=True)
def credentials(monkeypatch):
    monkeypatch.setattr(auth, "ACLED_EMAIL", "test@example.invalid")
    monkeypatch.setattr(auth, "ACLED_PASSWORD", "synthetic-test-password")
    monkeypatch.setattr(auth, "_token", "")
    monkeypatch.setattr(auth, "_expires_at", 0)


def test_token_reused_then_renewed_before_expiry(monkeypatch):
    response = Mock()
    response.json.side_effect = [
        {"access_token": "synthetic-first-token", "expires_in": 3600},
        {"access_token": "synthetic-second-token", "expires_in": 3600},
    ]
    request = Mock(return_value=response)
    clock = Mock(return_value=100)
    monkeypatch.setattr(auth.requests, "post", request)
    monkeypatch.setattr(auth, "monotonic", clock)
    assert (
        auth.authorization_headers()["Authorization"] == "Bearer synthetic-first-token"
    )
    clock.return_value = 3600
    assert (
        auth.authorization_headers()["Authorization"] == "Bearer synthetic-first-token"
    )
    clock.return_value = 3640
    assert (
        auth.authorization_headers()["Authorization"] == "Bearer synthetic-second-token"
    )
    assert request.call_count == 2
    assert request.call_args.kwargs["data"]["username"] == "test@example.invalid"
    assert request.call_args.kwargs["data"]["client_id"] == "acled"


def test_explicit_renewal(monkeypatch):
    response = Mock()
    response.json.return_value = {
        "access_token": "synthetic-new-token",
        "expires_in": 86400,
    }
    monkeypatch.setattr(auth.requests, "post", Mock(return_value=response))
    monkeypatch.setattr(auth, "_token", "synthetic-revoked-token")
    monkeypatch.setattr(auth, "_expires_at", float("inf"))
    assert (
        auth.authorization_headers(force_refresh=True)["Authorization"]
        == "Bearer synthetic-new-token"
    )


def test_password_pair_required(monkeypatch):
    monkeypatch.setattr(auth, "ACLED_PASSWORD", "")
    with pytest.raises(RuntimeError, match="ACLED_EMAIL and ACLED_PASSWORD"):
        auth.authorization_headers()


def test_legacy_token_fallback(monkeypatch):
    monkeypatch.setattr(auth, "ACLED_EMAIL", "")
    monkeypatch.setattr(auth, "ACLED_PASSWORD", "")
    monkeypatch.setattr(auth, "ACLED_ACCESS_TOKEN", "synthetic-legacy-token")
    assert (
        auth.authorization_headers()["Authorization"] == "Bearer synthetic-legacy-token"
    )


def test_authentication_error_does_not_leak_body(monkeypatch):
    monkeypatch.setattr(
        auth.requests,
        "post",
        Mock(side_effect=requests.RequestException("SENSITIVE BODY")),
    )
    with pytest.raises(RuntimeError) as error:
        auth.authorization_headers()
    assert "SENSITIVE" not in str(error.value)


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"access_token": "x", "expires_in": 0},
        {"access_token": "x", "expires_in": float("inf")},
        {"access_token": None, "expires_in": 86400},
    ],
)
def test_invalid_token_response_fails_closed(monkeypatch, payload):
    response = Mock()
    response.json.return_value = payload
    monkeypatch.setattr(auth.requests, "post", Mock(return_value=response))
    with pytest.raises(RuntimeError):
        auth.authorization_headers()


def test_short_token_is_reused(monkeypatch):
    response = Mock()
    response.json.return_value = {"access_token": "synthetic-token", "expires_in": 30}
    request = Mock(return_value=response)
    monkeypatch.setattr(auth.requests, "post", request)
    monkeypatch.setattr(auth, "monotonic", Mock(return_value=100))
    assert auth.authorization_headers() == auth.authorization_headers()
    request.assert_called_once()


def test_stale_rejections_share_one_renewal(monkeypatch):
    response = Mock()
    response.json.return_value = {
        "access_token": "synthetic-new-token",
        "expires_in": 3600,
    }
    request = Mock(return_value=response)
    monkeypatch.setattr(auth.requests, "post", request)
    monkeypatch.setattr(auth, "_token", "synthetic-rejected-token")
    monkeypatch.setattr(auth, "_expires_at", float("inf"))
    for _ in range(8):
        result = auth.authorization_headers(
            rejected_authorization="Bearer synthetic-rejected-token"
        )
        assert result["Authorization"] == "Bearer synthetic-new-token"
    request.assert_called_once()


@pytest.mark.parametrize("token", ["bad\r\ntoken", "bad token", "bad\x00token"])
def test_invalid_static_token_cannot_reach_request_headers(monkeypatch, token):
    monkeypatch.setattr(auth, "ACLED_EMAIL", "")
    monkeypatch.setattr(auth, "ACLED_PASSWORD", "")
    monkeypatch.setattr(auth, "ACLED_ACCESS_TOKEN", token)
    with pytest.raises(RuntimeError) as error:
        auth.authorization_headers()
    assert token not in str(error.value)
