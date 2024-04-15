import { format, parse } from 'date-fns'
import seed from 'seed-random'
import { dateSortCompare, isValidISODateString } from './dateUtil'
import { AllowedParamsInputType } from './searchParamsUtil'

export type Query<T> =
	| {
			data: T
			isPending: false
			error: null | string
	  }
	| {
			data?: T
			isPending: true
			error: null
	  }

export type EventType = {
	event_id: string
	event_type: string
	source: string
	topic: string
	date: string
	organizations: string[]
	description: string
	impact: number
}

const distinctiveTailwindColors = [
	`#a6cee3`,
	`#1f78b4`,
	`#b2df8a`,
	`#33a02c`,
	`#fb9a99`,
	`#e31a1c`,
	`#fdbf6f`,
	`#ff7f00`,
	`#cab2d6`,
	`#6a3d9a`,
	`#ffff99`,
	`#b15928`,
	'#4f8c9d',
	'#76dd78',
	'#ff0087',
	'#34daea',
	'#752e4f',
	'#c7c2ec',
	'#702cb4',
	'#5e9222',
	'#c00018',
	'#34f50e',
	'#3c4666',
	'#fe74fe',
	'#155126',
	'#ec9fe7',
	'#3163d8',
	'#cddb9b',
	'#893c02',
	'#f2a966',
	'#55450a',
	'#e2d923',
	`#8dd3c7`,
	`#ffffb3`,
	`#bebada`,
	`#fb8072`,
	`#80b1d3`,
	`#fdb462`,
	`#b3de69`,
	`#fccde5`,
	`#d9d9d9`,
	`#bc80bd`,
	`#ccebc5`,
	`#ffed6f`,
]

let impacts = [
	1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]
impacts = [...impacts, ...impacts, 20, 30, 40, 50]
impacts = [...impacts, 60, 70, 80, 90, 100, 100, 90, 90, 80]

const random = (seedString: string) =>
	Math.floor(seed(seedString)() * impacts.length)

export type ColorType = string

export type OrganisationType = {
	name: string
	color: ColorType
	count: number
}

export type EventsDataType = {
	events: EventType[]
	organisations: OrganisationType[]
}

interface DataResponseType<DataType> {
	data: DataType
	isPending: false
	error: null | string
}

export async function getEventsData(
	searchParams: AllowedParamsInputType = {},
): Promise<DataResponseType<EventsDataType>> {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL
	if (!apiUrl)
		throw new Error('NEXT_PUBLIC_API_URL env variable is not defined')
	try {
		const response = await fetch(`${apiUrl}/events`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				event_type: 'protest',
				source: 'acled',
				topic: 'climate_change',
				start_date: searchParams.from
					? format(searchParams.from, 'yyyy-MM-dd')
					: '2021-01-01',
				end_date: searchParams.to
					? format(searchParams.to, 'yyyy-MM-dd')
					: '2021-01-31',
			}),
		})
		const json = await response.json()
		const validatedResponse = validateGetDataResponse(json)

		const data = validatedResponse
			.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				impact: random(x.event_id),
				date: parse(x.date, 'yyyy-MM-dd', new Date()).toISOString(),
			})) as EventType[]
		const events = data.sort((a, b) => dateSortCompare(a.date, b.date))
		return {
			data: {
				events,
				organisations: extractEventOrganisations(events),
			},
			isPending: false,
			error: null,
		}
	} catch (error) {
		console.error(`Error fetching events: ${error}`)
		return {
			data: {
				events: [],
				organisations: [],
			},
			isPending: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}

export async function getEventData(
	id: string,
	searchParams: AllowedParamsInputType = {},
): Promise<DataResponseType<EventType | undefined>> {
	const allEvents = await getEventsData(searchParams)
	return {
		data: allEvents.data.events.find((x) => x.event_id === id),
		isPending: false,
		error: null,
	}
}

function extractEventOrganisations(events: EventType[]): OrganisationType[] {
	let alreadyUsedColors: string[] = []
	const organisationStrings = [
		...events
			.reduce((acc, event) => {
				event.organizations.forEach((organization) => acc.add(organization))
				return acc
			}, new Set<string>())
			.values(),
	]
	return organisationStrings
		.map((organization) => ({
			name: organization,
			count: events.filter((x) => x.organizations.includes(organization))
				.length,
		}))
		.sort((a, b) => b.count - a.count)
		.map((organization) => {
			if (organization.name.toLocaleLowerCase().trim() === '') {
				return {
					name: 'Unknown organisation',
					color: 'var(--grayMed)',
					count: events.filter((x) => x.organizations.filter((x) => !x)).length,
				}
			}
			let color = distinctiveTailwindColors.find(
				(color) => !alreadyUsedColors.includes(color),
			)
			if (!color) {
				alreadyUsedColors = [distinctiveTailwindColors[0]]
				color = distinctiveTailwindColors[0]
			}
			alreadyUsedColors.push(color)
			return {
				...organization,
				color: color,
			}
		})
}

function validateGetDataResponse(response: unknown): EventType[] {
	if (!response) throw new Error('Invalid response data (falsy value)')
	if (Array.isArray(response) && response.length < 2)
		throw new Error('Invalid response data (array too short)')
	if (
		isObject(response) &&
		'detail' in response &&
		Array.isArray(response.detail)
	) {
		if (response?.detail[0]?.msg) throw new Error(response.detail[0]?.msg)
		throw new Error('Invalid response data (was an object, expected an array)')
	}
	if (!Array.isArray(response))
		throw new Error('Invalid response data (not an array)')
	return response[1]
}

function isObject(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null
}
