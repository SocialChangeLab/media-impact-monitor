# Fulltexts

Browse news by topic and date range. Individual ACLED event lookups are unavailable; protest data is published only as daily organising-group and size summaries.

```js
import { queryApi } from './components/util.js'
const fulltexts = await queryApi('fulltexts', {
  media_source: 'news_online',
  topic: 'climate_change',
  start_date: '2022-12-10',
  end_date: '2023-01-05'
})
display(Inputs.table(fulltexts))
```
