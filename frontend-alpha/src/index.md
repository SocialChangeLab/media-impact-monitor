# Media Impact Monitor

```js
import * as vega from 'npm:vega'
import ve from 'npm:vega-embed@6'

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
```

```js
// const url = 'https://api.dev.mediaimpactmonitor.app'
const url = 'http://localhost:8000'
const organizers = [
  'Last Generation (Germany)',
  'Fridays for Future',
  'Extinction Rebellion'
]
let events = await fetch(`${url}/events`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'protest',
    source: 'acled',
    topic: 'climate_change',
    start_date: '2020-01-01',
    end_date: '2024-04-30',
    organizers: organizers
  })
})
  .then(res => res.json())
  .then(data => data['data'])

events = events.map(a => ({
  ...a,
  y: gaussianRandom(),
  size_number: Math.max(a.size_number, 1000),
  organizer: a.organizers.filter(b => organizers.includes(b))[0]
}))
// display(Inputs.table(events))
```

```js
const spec = {
  data: { values: events },
  mark: { type: 'circle', tooltip: true },
  encoding: {
    x: {
      field: 'date',
      type: 'temporal',
      axis: { title: 'Date' }
    },
    y: {
      field: 'y',
      type: 'quantitative',
      axis: { title: 'Value' }
    },
    color: {
      field: 'organizer',
      type: 'nominal',
      legend: { title: 'Organizer' }
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
}
display(await embed(spec))
```

```js
let trend = await fetch(`${url}/trend`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    trend_type: 'keywords',
    media_source: 'web_google',
    topic: 'climate_change',
    query: '"Letzte Generation"',
    start_date: '2023-01-01',
    end_date: '2024-04-30'
  })
})
  .then(res => res.json())
  .then(data => data['data'])
trend = Object.keys(trend).map(k => ({
  date: k,
  value: trend[k]
}))
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
      field: 'value',
      type: 'quantitative',
      axis: { title: 'Number of articles' }
    }
  },
  width: 600,
  height: 300
}
display(await embed(spec))
```
