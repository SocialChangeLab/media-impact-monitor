# Media Impact Monitor

```js
const url = 'https://api.dev.mediaimpactmonitor.app'
// const url = "http://localhost:8000"
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
    start_date: '2023-07-01',
    end_date: '2023-12-31',
    organizers: organizers
  })
})
  .then(res => res.json())
  .then(data => data['data'])
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random() // Converting [0,1) to (0,1]
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}
events = events.map(a => ({
  ...a,
  participants: Math.round(Math.random() * 100) * 10,
  y: gaussianRandom(),
  organizer: a.organizers.filter(b => organizers.includes(b))[0]
}))
// display(Inputs.table(events))
```

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
      field: 'participants',
      type: 'quantitative',
      legend: { title: 'Participants' }
    },
    tooltip: [
      { field: 'date', type: 'temporal', title: 'Date' },
      { field: 'organizer', type: 'nominal', title: 'Organizer' },
      { field: 'participants', type: 'quantitative', title: 'Participants' },
      { field: 'description', type: 'nominal', title: 'Description' }
    ]
  },
  width: 600,
  height: 300
}
display(await embed(spec))
```
