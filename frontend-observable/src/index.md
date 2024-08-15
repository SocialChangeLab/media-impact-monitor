# Media Impact Monitor

```js
import { embed, queryApi } from './components/util.js'

const protest_sources = ['acled', 'press_releases']
const protest_source = await view(
  Inputs.select(protest_sources, {
    value: 'acled',
    label: 'protest data source'
  })
)
const media_sources = {
  news_online: 'online news',
  news_print: 'print news',
  web_google: 'google search volume'
}
const media_source = view(
  Inputs.select(Object.keys(media_sources), {
    value: 'news_online',
    label: 'media data source'
  })
)
```

```js
let events = await queryApi('events', {
  source: protest_source,
  topic: 'climate_change'
})

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random() // Converting [0,1) to (0,1]
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

events = events.map(a => ({
  ...a,
  organizer: a.organizers[0],
  organizers_text: a.organizers.join(', '),
  chart_position: gaussianRandom()
}))
// display(Inputs.table(events))
```

```js
const keyword_plot = (trend, title) => ({
  data: { values: trend },
  width: 600,
  height: 100,
  title: title,
  mark: { type: 'line', interpolate: 'basis' },
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
      axis: { title: 'Number of articles' },
      stack: 'center'
    },
    color: {
      field: 'topic',
      type: 'nominal'
    }
  }
})

const sentiment_plot = (trend, title) => ({
  data: { values: trend },
  width: 600,
  height: 100,
  title: title,
  mark: { type: 'area', interpolate: 'basis' },
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
      // stack: 'center'
    },
    color: {
      field: 'topic',
      type: 'nominal',
      scale: {
        domain: ['positive', 'neutral', 'negative'],
        range: ['green', 'yellow', 'red']
      }
    }
  }
})

const topic_plot = (trend, title) => ({
  data: { values: trend },
  width: 600,
  height: 100,
  title: title,
  mark: { type: 'area', interpolate: 'basis' },
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
      axis: { title: 'Number of articles' },
      stack: 'center'
    },
    color: {
      field: 'topic',
      type: 'nominal'
    }
  }
})

const keyword_trend = await queryApi('trend', {
  trend_type: 'keywords',
  media_source: media_source,
  topic: 'climate_change'
})
const trend_plots = [
  keyword_plot(
    keyword_trend.trends,
    'keywords in german ' + media_sources[media_source]
  )
]
const sentiment_trend_a = await queryApi('trend', {
  trend_type: 'sentiment',
  media_source: media_source,
  topic: 'climate_change',
  sentiment_target: 'activism',
  aggregation: 'monthly'
})
if (sentiment_trend_a.applicability) {
  trend_plots.push(
    sentiment_plot(
      sentiment_trend_a.trends,
      'sentiments towards protests in german ' + media_sources[media_source]
    )
  )
}
const sentiment_trend_b = await queryApi('trend', {
  trend_type: 'sentiment',
  media_source: media_source,
  topic: 'climate_change',
  sentiment_target: 'policy',
  aggregation: 'monthly'
})
if (sentiment_trend_b.applicability) {
  trend_plots.push(
    sentiment_plot(
      sentiment_trend_b.trends,
      'sentiments towards policy in german ' + media_sources[media_source]
    )
  )
}
const topic_trend = await queryApi('trend', {
  trend_type: 'topic',
  media_source: media_source,
  topic: 'climate_change',
  aggregation: 'monthly'
})
if (topic_trend.applicability) {
  trend_plots.push(
    topic_plot(
      topic_trend.trends,
      'topics in german ' + media_sources[media_source]
    )
  )
}

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
              { year: 2022, month: 'jan', date: 1 },
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
      title: `climate protest events in germany (${protest_source})`,
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
    ...trend_plots
  ],
  resolve: { scale: { color: 'independent', size: 'independent' } }
}
display(await embed(spec))
```
