# Policy

```js
import { embed, queryApi } from './components/util.js'

let policy = await queryApi('policy', {
  policy_level: 'Germany',
  policy_type: 'Gesetzgebung',
  start_date: '2024-01-01',
  end_date: '2024-04-30'
})
display(Inputs.table(policy))
```

```js
let policy_ = policy.map(a => ({ ...a, sachgebiet_1: a.sachgebiet[0] }))
const spec = {
  data: { values: policy_ },
  width: 600,
  height: 400,
  mark: { type: 'circle', tooltip: true },
  encoding: {
    x: {
      field: 'datum',
      type: 'temporal'
    },
    y: {
      field: 'sachgebiet_1',
      type: 'nominal'
    },
    tooltip: [
      { field: 'id' },
      { field: 'datum', type: 'temporal' },
      { field: 'aktualisiert', type: 'temporal' },
      { field: 'vorgangstyp' },
      { field: 'titel' },
      { field: 'abstract' },
      { field: 'initiative' },
      { field: 'sachgebiet' },
      { field: 'beratungsstand' }
    ]
  }
}
display(await embed(spec))
```
