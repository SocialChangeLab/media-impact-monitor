import { BaseLayout } from '@components/BaseLayout'
import { getEventsData } from '@utility/eventsUtil'
import EventsTable from './table'

export default async function EventPage() {
	const data = await getEventsData()
	return (
		<BaseLayout currentPage="events">
			<div className="px-6 pt-8 pb-16">
				<EventsTable data={data} />
			</div>
		</BaseLayout>
	)
}
