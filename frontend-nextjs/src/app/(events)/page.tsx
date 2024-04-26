import EventsTimeline from '@components/EventsTimeline'
import { getEventsData } from '@utility/eventsUtil'
import { parseSearchParams } from '@utility/searchParamsUtil'
import EventsTable from './table'

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Record<string, string>
}) {
	const parsedSearchParams = parseSearchParams(
		new URLSearchParams(searchParams),
	)
	const { data } = await getEventsData(parsedSearchParams)
	return (
		<>
			<div className="flex flex-col gap-4">
				<EventsTimeline {...data} />
			</div>
			<div className="flex flex-col gap-4 pt-8">
				<EventsTable data={data.events} />
			</div>
		</>
	)
}
