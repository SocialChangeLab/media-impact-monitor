from os import environ

from dotenv import load_dotenv

# read environment variables from .env file
# see .env.example for the required variables
# override any existing environment variables
load_dotenv(override=True)

ACLED_EMAIL = environ["ACLED_EMAIL"]
ACLED_KEY = environ["ACLED_KEY"]
MEDIACLOUD_API_TOKEN = environ["MEDIACLOUD_API_TOKEN"]
ZENROWS_API_KEY = environ["ZENROWS_API_KEY"]
AZURE_API_BASE = environ["AZURE_API_BASE"]
AZURE_API_VERSION = environ["AZURE_API_VERSION"]
AZURE_API_KEY = environ["AZURE_API_KEY"]
DATAFORSEO_EMAIL = environ["DATAFORSEO_EMAIL"]
DATAFORSEO_PASSWORD = environ["DATAFORSEO_PASSWORD"]
BUNDESTAG_API_KEY = environ["BUNDESTAG_API_KEY"]
SENTRY_DSN = environ["SENTRY_DSN"]
AI_TREND_RESOLUTION = environ.get("AI_TREND_RESOLUTION", 0.01)

assert ACLED_EMAIL
assert ACLED_KEY
assert MEDIACLOUD_API_TOKEN
assert ZENROWS_API_KEY
assert AZURE_API_BASE
assert AZURE_API_VERSION
assert AZURE_API_KEY
assert DATAFORSEO_EMAIL
assert DATAFORSEO_PASSWORD
assert BUNDESTAG_API_KEY
assert SENTRY_DSN
