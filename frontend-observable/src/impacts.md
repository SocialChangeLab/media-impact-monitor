# Impact

## Daily

```js
import { embed, queryApi } from './components/util.js'

let impact = await queryApi('impact', {
  method: 'time_series_regression',
  impacted_trend: {
    trend_type: 'keywords',
    media_source: 'news_print',
    topic: 'climate_change'
  },
  organizer: 'Fridays for Future',
  start_date: '2020-04-10',
  end_date: '2022-04-30'
})
display(impact)
```

```js
const impacts = Object.entries(impact.impact_estimates).map(([k, v]) => ({
  topic: k,
  ...v.absolute_impact
}))
const spec = {
  data: { values: impacts },
  layer: [
    {
      mark: 'errorbar',
      encoding: {
        x: { field: 'topic', type: 'nominal' },
        y: { field: 'ci_lower', type: 'quantitative', title: '' },
        y2: { field: 'ci_upper', type: 'quantitative' }
      }
    },
    {
      mark: { type: 'circle', color: 'black' },
      encoding: {
        x: { field: 'topic', type: 'nominal' },
        y: {
          field: 'mean',
          type: 'quantitative',
          title: 'Number of additional articles'
        }
      }
    }
  ],
  title: 'Impact on all topics',
  width: 200
}
display(await embed(spec))
```

```js
const spec_ = (topic, data_) => ({
  data: { values: data_ },
  layer: [
    {
      mark: 'errorband',
      encoding: {
        x: {
          field: 'date',
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
        x: { field: 'date', type: 'quantitative' },
        y: {
          field: 'mean',
          type: 'quantitative',
          title: 'Number of additional articles'
        }
      }
    }
  ],
  title: `Impact on ${topic}`
})
for (const topic in impact.impact_estimates) {
  let data = impact.impact_estimates[topic].absolute_impact_time_series
  data = Object.keys(data)
    .map(k => ({ day: parseInt(k), ...data[k] }))
    .sort((a, b) => a.day - b.day)
  display(await embed(spec_(topic, data)))
}
```

<!-- ## Weekly

```js
let impact_weekly = await queryApi('impact', {
  cause: event_ids,
  effect: {
    trend_type: 'keywords',
    media_source: 'news_online',
    topic: 'climate_change',
    aggregation: 'weekly'
  },
  method: 'interrupted_time_series'
})
display(html`${impact.method_applicability_reason}`)
```

```js
for (const topic in impact_weekly.time_series) {
  let data = impact_weekly.time_series[topic]
  data = Object.keys(data)
    .map(k => ({ day: parseInt(k), ...data[k] }))
    .sort((a, b) => a.day - b.day)
  display(await embed(spec_(topic, data)))
}
``` -->
