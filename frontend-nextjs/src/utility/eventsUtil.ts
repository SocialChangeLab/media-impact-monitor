import { parse } from '@formkit/tempo'
import { dateSortCompare, isValidISODateString } from './dateUtil'

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

export type ColorType = string

export type OrganisationType = {
	name: string
	color: ColorType
	count: number
}

export type EventDataType = {
	events: EventType[]
	organisations: OrganisationType[]
}

export async function getEventsData(): Promise<EventDataType> {
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
				start_date: '2021-01-01',
				end_date: '2021-01-31',
			}),
		})
		const jsonRes = (await response.json()) as EventType[][]
		const data = jsonRes[1]
			.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				impact: Math.random(),
				date: parse(x.date).toISOString(),
			})) as EventType[]
		const events = data.sort((a, b) => dateSortCompare(a.date, b.date))
		return {
			events,
			organisations: extractEventOrganisations(events),
		}
	} catch (error) {
		console.error(`Error fetching events: ${error}`)
		return {
			events: [],
			organisations: [],
		}
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
