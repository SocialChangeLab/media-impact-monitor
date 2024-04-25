# Python backend

## Usage

- `poetry install` to install dependencies
- `poetry run python xyz.py` to run a Python script
- `poetry run pytest` to run tests
- `poetry run pytest -k fridays` to run only tests with "fridays" in their definition name
- `poetry run uvicorn media_impact_monitor.api:app --host 0.0.0.0 --port 8000` to serve the API
- `poetry run py-spy record -o profile.svg -- python xyz.py` to do profiling


## Conventions

### Date types

- For dates use `datetime.date`, also within Pandas dataframes (where usually one might use `pd.Timestamp`, but for consistency we do not).
- For datetimes: t.b.d.
