# Sentiments

```js
import { embed, queryApi } from './components/util.js'
```

```js
const trend_activism = await queryApi('trend', {
  trend_type: 'sentiment',
  media_source: 'news_online',
  topic: 'activism',
  start_date: '2022-01-01',
  end_date: '2024-08-02'
})
display(trend_activism)

const spec = (data, title) => ({
  data: { values: data },
  width: 600,
  height: 100,
  title: title,
  mark: { type: 'line', interpolate: 'basis' },
  encoding: {
    x: {
      field: 'date',
      type: 'temporal',
      axis: { title: null }
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
})
display(await embed(spec(trend_activism.trends, 'Sentiment towards protests')))
```

```js
const trend_policy = await queryApi('trend', {
  trend_type: 'sentiment',
  media_source: 'news_online',
  topic: 'policy',
  start_date: '2022-01-01',
  end_date: '2024-08-02'
})
display(trend_policy)
display(await embed(spec(trend_policy.trends, 'Sentiment towards policy')))
```
