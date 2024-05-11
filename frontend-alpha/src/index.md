# Media Impact Monitor

```js
import * as vega from 'npm:vega'
import ve from 'npm:vega-embed@6'

// const url = 'https://api.dev.mediaimpactmonitor.app'
const url = 'http://localhost:8000'

const embed = async (spec, options) => {
  // see https://observablehq.com/@mbostock/hello-vega-embed
  const div = document.createElement('div')
  div.value = (await ve(div, spec, options)).view
  return div
}
embed.changeset = vega.changeset

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random() // Converting [0,1) to (0,1]
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

const queryApi = (endpoint, query) =>
  fetch(`${url}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  })
    .then(res => res.json())
    .then(data => data['data'])
    .catch(err => console.warn(err))
```

```js
console.log('oi')
let events = await queryApi('events', {
  source: 'acled',
  topic: 'climate_change'
})

events = events.map(a => ({
  ...a,
  y: gaussianRandom(),
  size_number: Math.max(a.size_number, 1000),
  organizer: a.organizers[0]
}))
// display(Inputs.table(events))
```

```js
const spec = {
  data: { values: events },
  vconcat: [
    {
      mark: { type: 'circle', tooltip: true },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          axis: { title: null, grid: false },
          scale: { domain: { selection: 'brush' } }
        },
        y: {
          field: 'y',
          type: 'quantitative',
          axis: null
        },
        color: {
          field: 'organizer',
          type: 'nominal',
          legend: { title: 'Organizer' },
          sort: {
            field: 'organizer',
            op: 'count',
            order: 'descending'
          }
        },
        size: {
          field: 'size_number',
          type: 'quantitative',
          legend: { title: 'Participants' }
        },
        tooltip: [
          { field: 'date', type: 'temporal', title: 'Date' },
          { field: 'organizer', type: 'nominal', title: 'Organizer' },
          { field: 'size_text', type: 'nominal', title: 'Participants' },
          { field: 'description', type: 'nominal', title: 'Description' }
        ]
      },
      width: 600,
      height: 300
    },
    {
      width: 600,
      height: 40,
      mark: 'bar',
      selection: {
        brush: { type: 'interval', encodings: ['x'] }
      },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          axis: { tickCount: 'year', title: null },
          timeUnit: { unit: 'yearmonth' }
        },
        y: {
          field: 'size_number',
          type: 'quantitative',
          axis: { grid: false, title: null },
          aggregate: 'sum'
        }
      }
    }
  ]
}
display(await embed(spec))
```

```js
const data_sources = ['news_online', 'web_google']
const media_source = view(
  Inputs.select(data_sources, {
    value: 'news_online',
    label: 'Media data source'
  })
)
```

```js
let trend = await queryApi('trend', {
  trend_type: 'keywords',
  media_source: media_source,
  topic: 'climate_change'
})
// display(Inputs.table(trend))
```

```js
const spec = {
  data: { values: trend },
  mark: { type: 'line', tooltip: true },
  encoding: {
    x: {
      field: 'date',
      type: 'temporal',
      axis: { title: 'Date' }
    },
    y: {
      field: 'n_articles',
      type: 'quantitative',
      axis: { title: 'Number of articles' }
    },
    color: {
      field: 'topic',
      type: 'nominal'
    }
  },
  width: 600,
  height: 300
}
display(await embed(spec))
```

<!-- ```js
const event_ids = events.map(a => a.event_id)
let impact = queryApi('impact', {
  cause: event_ids,
  effect: {
    trend_type: 'keywords',
    media_source: 'news_online',
    query: '"Letzte Generation"'
  },
  method: 'interrupted_time_series'
})
impact = (await impact).time_series
impact = Object.keys(impact)
  .map(k => ({ day: parseInt(k), ...impact[k] }))
  .sort((a, b) => a.day - b.day)
// display(Inputs.table(impact))
```

```js
const spec = {
  data: { values: impact },
  layer: [
    {
      mark: 'errorband',
      encoding: {
        x: {
          field: 'day',
          type: 'quantitative',
          title: 'Days after protest'
        },
        y: { field: 'ci_lower', type: 'quantitative', title: '' },
        y2: { field: 'ci_upper', type: 'quantitative' }
      }
    },
    {
      mark: { type: 'line', color: 'red' },
      encoding: {
        x: { field: 'day', type: 'quantitative' },
        y: {
          field: 'mean',
          type: 'quantitative',
          title: 'Number of additional articles'
        }
      }
    }
  ],
  title: 'Impact'
}

display(await embed(spec))
``` -->
