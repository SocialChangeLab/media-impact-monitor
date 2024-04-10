import { Layout as BaseLayout } from '@components/layout'
import { getEventsData } from '@utility/eventsUtil'
import EventsTable from './table'

export default async function EventPage() {
	const data = await getEventsData()
	return (
		<BaseLayout currentPage="events">
			<EventsTable data={data} />
		</BaseLayout>
	)
}
