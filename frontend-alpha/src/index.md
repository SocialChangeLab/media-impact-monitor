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
let events = await queryApi('events', {
  source: 'acled',
  topic: 'climate_change'
})

events = events.map(a => ({
  ...a,
  organizer: a.organizers[0],
  organizers_text: a.organizers.join(', ')
}))
// display(Inputs.table(events))
```

```js
const media_sources = ['news_online', 'web_google']
// const media_source = view(
//   Inputs.select(media_sources, {
//     value: 'news_online',
//     label: 'Media data source'
//   })
// )
```

```js
let trends = media_sources.map(source =>
  queryApi('trend', {
    trend_type: 'keywords',
    media_source: source,
    topic: 'climate_change'
  })
)
trends = await Promise.all(trends)
const trend = trends[0]
// display(Inputs.table(trend))
```

```js
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const lastDay = new Date(year, month + 1, 0).getDate()
const spec = {
  vconcat: [
    {
      data: { values: events },
      width: 600,
      height: 20,
      mark: 'bar',
      params: [
        {
          name: 'brush',
          select: { type: 'interval', encodings: ['x'] },
          value: {
            x: [
              { year: 2023, month: 'jan', date: 1 },
              { year: year, month: month, date: lastDay }
            ]
          }
        }
      ],
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
          aggregate: 'count'
        }
      }
    },
    {
      data: { values: events },
      width: 600,
      height: 300,
      title: 'climate protest events in germany',
      mark: { type: 'circle', tooltip: true },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          axis: { title: null, grid: false },
          scale: { domain: { selection: 'brush' } }
        },
        y: {
          field: 'chart_position',
          type: 'quantitative',
          axis: null
        },
        color: {
          field: 'organizer',
          type: 'nominal',
          legend: {
            title: 'Organizer'
            // columns: 2
            //symbolLimit: 5
          },
          sort: {
            field: 'organizer',
            op: 'count',
            order: 'descending'
          }
        },
        size: {
          field: 'size_number',
          type: 'quantitative',
          legend: { title: 'Participants' },
          scale: { type: 'linear', rangeMin: 20 }
        },
        tooltip: [
          { field: 'date', type: 'temporal', title: 'Date' },
          { field: 'organizers_text', type: 'nominal', title: 'Organizer' },
          { field: 'size_text', type: 'nominal', title: 'Participants' },
          { field: 'description', type: 'nominal', title: 'Description' }
        ]
      }
    },
    {
      data: { values: trends[0] },
      width: 600,
      height: 100,
      title: 'coverage of climate in german online news',
      mark: { type: 'line', interpolate: 'step-after' },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          axis: { title: null },
          scale: { domain: { selection: 'brush' } }
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
      }
    },
    {
      data: { values: trends[1] },
      width: 600,
      height: 100,
      title: 'google search volume in germany',
      mark: { type: 'line', interpolate: 'step-after' },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          axis: { title: null },
          scale: { domain: { selection: 'brush' } }
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
      }
    }
  ],
  resolve: { scale: { color: 'independent', size: 'independent' } }
}
display(await embed(spec))
```

```js
const event_ids = events.map(a => a.event_id)
let impact = await queryApi('impact', {
  cause: event_ids,
  effect: {
    trend_type: 'keywords',
    media_source: 'news_online',
    topic: 'climate_change'
  },
  method: 'interrupted_time_series'
})
display(impact.method_applicability_reason)
impact = impact.time_series
impact = Object.keys(impact)
  .map(k => ({ day: parseInt(k), ...impact[k] }))
  .sort((a, b) => a.day - b.day)
display(Inputs.table(impact))
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
          title: 'Days after protest',
          axis: { values: { expr: '[-7,0,7,14,21]' } }
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
```
