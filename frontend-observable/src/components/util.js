import * as vega from 'npm:vega'
import ve from 'npm:vega-embed@6'

// const url = 'https://api.dev.mediaimpactmonitor.app'
const url = 'http://localhost:8000'

export const embed = async (spec, options) => {
    // see https://observablehq.com/@mbostock/hello-vega-embed
    const div = document.createElement('div')
    div.value = (await ve(div, spec, options)).view
    return div
}
embed.changeset = vega.changeset

const summaryFields = ['summary_id', 'source', 'date', 'organizers', 'size_number', 'event_count', 'unknown_size_count']

function isSummaryDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
}

function isAcledSummary(row) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return false
    return Object.keys(row).length === summaryFields.length &&
        Object.keys(row).every(key => summaryFields.includes(key)) &&
        row.source === 'acled' && typeof row.summary_id === 'string' && row.summary_id.length > 0 &&
        isSummaryDate(row.date) && Array.isArray(row.organizers) &&
        row.organizers.every(name => typeof name === 'string') &&
        (row.size_number === null || (typeof row.size_number === 'number' && Number.isFinite(row.size_number) && row.size_number >= 0)) &&
        Number.isSafeInteger(row.event_count) && row.event_count > 0 &&
        Number.isSafeInteger(row.unknown_size_count) && row.unknown_size_count >= 0 &&
        row.unknown_size_count <= row.event_count &&
        ((row.size_number === null) === (row.unknown_size_count === row.event_count))
}

export const queryApi = (endpoint, query) =>
    fetch(`${url}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    })
        .then(res => res.json())
        .then(data => {
            if (endpoint !== 'events' || query.source !== 'acled') return data.data
            if (!Array.isArray(data.data) || !data.data.every(isAcledSummary)) {
                throw new Error('ACLED summary response required')
            }
            return data.data
        })
        .catch(err => console.warn(err))

export const queryApiGet = (endpoint) =>
    fetch(`${url}/${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .catch(err => console.warn(err))