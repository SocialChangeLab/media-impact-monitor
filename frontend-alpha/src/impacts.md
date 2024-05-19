# Impact

## Daily

```js
import { embed, queryApi } from './components/util.js'

let events = await queryApi('events', {
  source: 'acled',
  topic: 'climate_change'
})
events = events
  .filter(a => a.organizers.includes('Last Generation (Germany)'))
  .slice(-100)

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
display(html`${impact.method_applicability_reason}`)
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

## Weekly

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
```
