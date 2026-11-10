# Media Impact Monitor Data API

API documentation is available at https://api.dev.mediaimpactmonitor.app/docs.

## Usage examples

### Python

`pip install requests`

```python
import requests

res = requests.post(
    "https://api.dev.mediaimpactmonitor.app/events",
    json={
        "source": "acled",
        "topic": "climate_change",
        "start_date": "2021-01-01",
        "end_date": "2021-01-31",
    },
)
print(res.json()["data"][0])
```

### Node.js

`npm add axios`

```javascript
const axios = require("axios");

axios.post("https://api.dev.mediaimpactmonitor.app/events", {
    source: "acled",
    topic: "climate_change",
    start_date: "2021-01-01",
    end_date: "2021-01-31",
}).then((res) => {
    console.log(res.data.data[0]);
});
```

### Javascript (frontend)

```javascript
fetch("https://api.dev.mediaimpactmonitor.app/events", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
            source: "acled",
        topic: "climate_change",
        start_date: "2021-01-01",
        end_date: "2021-01-31",
    }),
})
    .then((res) => res.json())
    .then((data) => console.log(data.data[0]));
```



## ACLED publication boundary

`POST /events` with `source: "acled"` returns daily summaries for each organising-group combination, not individual event records. The response fields are `summary_id`, `source`, `date`, `organizers`, `size_number`, `event_count`, and `unknown_size_count`. `summary_id` identifies a day/group bucket and is derived only from its date and group names. It is not an ACLED event identifier.

`size_number` sums known size estimates and is null when every size is unknown. `unknown_size_count` counts missing estimates. Jointly organised protests are counted once within each summary; organisation totals overlap. No descriptions, locations, event types, raw size text, or individual-event IDs are returned, even for legacy cached records. Individual-event `/fulltexts` lookups are rejected before cache retrieval.

Omitting `topic` for ACLED uses `climate_change`; `gaza_crisis` can be selected explicitly.

The `press_releases` source retains its event-record response. Internal ACLED records remain available to the existing impact analysis; its public output contains estimates, not underlying records.

### ACLED authentication

Set `ACLED_EMAIL` and `ACLED_PASSWORD` in backend environment variables and GitHub Actions secrets. The backend acquires an OAuth token in memory, reuses it until one minute before expiry (or a 10% margin for short-lived tokens), and retries an unauthorized data request once with a new token. Authentication and authorized HTTP requests are not disk-memoized; only private processed data is cached. ACLED documents token lifetimes in its [getting-started guide](https://acleddata.com/api-documentation/getting-started).

Both email and password must be configured together. A legacy `ACLED_ACCESS_TOKEN` remains a fallback when neither is configured, and must be renewed manually. Live ACLED tests remain blocking; a missing or invalid credential cannot produce a successful check. Set the new environment variables in Railway production and staging before deploying this change.
