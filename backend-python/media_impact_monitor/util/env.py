from os import environ

from dotenv import load_dotenv

load_dotenv()

PORT = int(environ.get("PORT", 8000))

ACLED_EMAIL = environ["ACLED_EMAIL"]
ACLED_KEY = environ["ACLED_KEY"]
MEDIACLOUD_API_TOKEN = environ["MEDIACLOUD_API_TOKEN"]
ZENROWS_API_KEY = environ["ZENROWS_API_KEY"]

assert PORT
assert ACLED_EMAIL
assert ACLED_KEY
assert MEDIACLOUD_API_TOKEN
assert ZENROWS_API_KEY
