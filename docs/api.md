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
        "event_type": "protest",
        "source": "acled",
        "topic": "climate_change",
        "start_date": "2021-01-01",
        "end_date": "2021-01-31",
    },
)
print(res.json()[0])
```

### Node.js

`npm add axios`

```javascript
const axios = require("axios");

axios.post("https://api.dev.mediaimpactmonitor.app/events", {
    event_type: "protest",
    source: "acled",
    topic: "climate_change",
    start_date: "2021-01-01",
    end_date: "2021-01-31",
}).then((res) => {
    console.log(res.data[0]);
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
        event_type: "protest",
        source: "acled",
        topic: "climate_change",
        start_date: "2021-01-01",
        end_date: "2021-01-31",
    }),
})
    .then((res) => res.json())
    .then((data) => console.log(data[0]));
```

