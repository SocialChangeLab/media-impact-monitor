import * as vega from 'npm:vega'
import ve from 'npm:vega-embed@6'

const url = 'https://api.dev.mediaimpactmonitor.app'
// const url = 'http://localhost:8000'

export const embed = async (spec, options) => {
    // see https://observablehq.com/@mbostock/hello-vega-embed
    const div = document.createElement('div')
    div.value = (await ve(div, spec, options)).view
    return div
}
embed.changeset = vega.changeset

export const queryApi = (endpoint, query) =>
    fetch(`${url}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    })
        .then(res => res.json())
        .then(data => data.data)
        .catch(err => console.warn(err))
