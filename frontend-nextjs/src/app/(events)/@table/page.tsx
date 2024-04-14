import { getEventsData } from '@utility/eventsUtil'
import { parseSearchParams } from '@utility/searchParamsUtil'
import EventsTable from './table'

export default async function EventsTablePage({
	searchParams,
}: {
	searchParams: Record<string, string>
}) {
	const parsedSearchParams = parseSearchParams(
		new URLSearchParams(searchParams),
	)
	const { data } = await getEventsData(parsedSearchParams)
	return <EventsTable initialData={data} />
}
