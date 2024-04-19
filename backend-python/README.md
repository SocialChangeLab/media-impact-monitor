# Python backend

## Usage

- `poetry install` to install dependencies
- `poetry run python xyz.py` to run a Python script
- `poetry run pytest` to run tests
- `poetry run pytest -k fridays` to run only tests with "fridays" in their definition name
- `poetry run uvicorn media_impact_monitor.api:app --host 0.0.0.0 --port 8000` to serve the API
