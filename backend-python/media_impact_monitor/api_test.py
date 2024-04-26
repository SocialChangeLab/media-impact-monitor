import pytest
from fastapi.testclient import TestClient

from media_impact_monitor.api import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.mark.filterwarnings("ignore::DeprecationWarning")
def test_get_events_success(client):
    response = client.post(
        "/events/",
        json={
            "event_type": "protest",
            "source": "acled",
            "topic": "climate_change",
            "start_date": "2021-01-01",
            "end_date": "2021-01-31",
        },
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.filterwarnings("ignore::DeprecationWarning")
def test_get_events_failure(client):
    response = client.post(
        "/events/",
        json={
            "event_type": "protest",
            "source": "invalid_source",  # This should cause a failure
            "topic": "climate_change",
            "start_date": "2021-01-01",
            "end_date": "2021-01-31",
        },
    )
    assert response.status_code == 422
    assert "detail" in response.json()


@pytest.mark.skip(reason="The Genios API is currently down.")
@pytest.mark.filterwarnings("ignore::DeprecationWarning")
def test_get_trend_success(client):
    response = client.post(
        "/trend/",
        json={
            "trend_type": "keywords",
            "media_source": "news_print",
            "query": "climate change",
            "start_date": "2021-01-01",
            "end_date": "2021-01-31",
        },
    )
    print(response.text)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.filterwarnings("ignore::DeprecationWarning")
def test_get_trend_failure(client):
    response = client.post(
        "/trend/",
        json={
            "trend_type": "keywords",
            "media_source": "unsupported_source",
            "query": "climate change",
            "start_date": "2021-01-01",
            "end_date": "2021-01-31",
        },
    )
    assert response.status_code == 422
    assert "detail" in response.json()
