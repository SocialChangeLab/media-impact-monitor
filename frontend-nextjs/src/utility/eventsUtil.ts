import { EventType } from './useEvents'

export async function getEventsData() {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL
	if (!apiUrl)
		throw new Error('NEXT_PUBLIC_API_URL env variable is not defined')
	const response = await fetch(`${apiUrl}/events`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			event_type: 'protest',
			source: 'acled',
			topic: 'climate_change',
			start_date: '2021-01-01',
			end_date: '2021-01-31',
		}),
	})
	const jsonRes = (await response.json()) as EventType[][]
	const data = jsonRes[1].map((x) => ({
		...x,
		date: new Date(x.date).toISOString(),
	})) as EventType[]
	return data.sort((a, b) => {
		if (a.date < b.date) return 1
		if (a.date > b.date) return -1
		return 0
	})
}
