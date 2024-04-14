import EventsTimeline from '@components/EventsTimeline'
import { getEventsData } from '@utility/eventsUtil'
import { parseSearchParams } from '@utility/searchParamsUtil'

export default async function EventsTimelinePage({
	searchParams,
}: {
	searchParams: Record<string, string>
}) {
	const parsedSearchParams = parseSearchParams(
		new URLSearchParams(searchParams),
	)
	const { data } = await getEventsData(parsedSearchParams)
	return <EventsTimeline {...data} />
}
