# Sentiments

```js
import { embed, queryApi } from './components/util.js'
```

```js
const sentiment_trend = await queryApi('trend', {
  trend_type: 'sentiment',
  media_source: 'news_online',
  topic: 'climate_change',
  start_date: '2024-05-01',
  end_date: '2024-07-31'
})
display(sentiment_trend)

const spec = {
  data: { values: sentiment_trend.trends },
  width: 600,
  height: 100,
  title: 'Sentiment',
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
}
display(await embed(spec))
```
