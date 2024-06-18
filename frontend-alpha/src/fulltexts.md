# Fulltexts

```js
import { embed, queryApi } from './components/util.js'
const events = await queryApi('events', {
  source: 'acled',
  topic: 'climate_change',
  start_date: '2024-05-01',
  end_date: '2024-05-30'
})
const event_id = await view(
  Inputs.select(
    events.map(a => a.event_id),
    { label: 'event_id' }
  )
)
```

```js
const event = events.find(a => a.event_id === event_id)
for (const k in event) {
  display(`${k}: ${event[k]}`)
}
const fulltexts = await queryApi('fulltexts', {
  media_source: 'news_online',
  event_id: event_id
})
display(Inputs.table(fulltexts))
```
