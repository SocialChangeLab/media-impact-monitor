# Python backend

## Usage

- `poetry install` to install dependencies
- `poetry run python xyz.py` to run a Python script
- `poetry run pytest` to run tests
- `poetry run uvicorn media_impact_monitor.api:app --host 0.0.0.0 --port 8000` to serve the API
- `poetry run pytest -k fridays` to run only tests with "fridays" in their definition name
- `poetry run uvicorn media_impact_monitor.api:app --host 0.0.0.0 --port 8000` to serve the API
- `poetry run py-spy record -o profile.svg -- python xyz.py` to do profiling

## Deployment

Continuous deployment is currently set up with railway.app.

Important: Configure a `PORT` environment variable there, otherwise the app will not be accessible and will be `Shutting down` for no apparent reason.

## 3rd party services

These are configured via a `.env` file, see [`.env.example`](../.env.example).

### Azure OpenAI

We have defined the following endpoints on Azure OpenAI:

- `gpt-35-turbo`: `gpt-3.5-turbo-1106` (16k tokens context)
- `gpt-4`: `gpt-4-turbo-2024-04-09` (128k tokens context)

Azure OpenAI uses content filters, also for the input texts, that cannot be switched off, but their thresholds can be set to high.

Similar models are also available via OpenAI directly.

## Conventions

### Date types

- For dates use `datetime.date`, also within Pandas dataframes (where usually one might use `pd.Timestamp`, but for consistency we do not).
- For datetimes: t.b.d.
