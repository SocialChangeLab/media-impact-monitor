# Impact

## Daily

```js
import { embed, queryApi } from './components/util.js'

let impact = await queryApi('impact', {
  method: 'interrupted_time_series',
  impacted_trend: {
    trend_type: 'keywords',
    media_source: 'news_print',
    topic: 'climate_change'
  },
  organizer: 'Last Generation (Germany)',
  end_date: '2022-04-30'
})
// display(html`${impact.method_applicability_reason}`)
display(impact)
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
for (const topic in impact.time_series) {
  let data = impact.time_series[topic]
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
