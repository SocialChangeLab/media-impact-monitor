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
  news_online: 'coverage of climate in german online news',
  news_print: 'coverage of climate in german print news',
  web_google: 'google search volume in germany'
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
const trend_plot = (trend, title) => ({
  data: { values: trend },
  width: 600,
  height: 100,
  title: title,
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
})

const keyword_trend = await queryApi('trend', {
  trend_type: 'keywords',
  media_source: media_source,
  topic: 'climate_change'
})
const trend_plots = [
  trend_plot(keyword_trend.trends, media_sources[media_source])
]
const sentiment_trend = await queryApi('trend', {
  trend_type: 'sentiment',
  media_source: media_source,
  topic: 'climate_change'
})
if (sentiment_trend.applicability) {
  trend_plots.push(
    trend_plot(
      sentiment_trend.trends,
      media_sources[media_source].replace(/coverage of/, 'sentiment of')
    )
  )
}
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
