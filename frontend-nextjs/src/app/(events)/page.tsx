import EventsTimeline from '@components/EventsTimeline'
import { getEventsData } from '@utility/eventsUtil'
import EventsTable from './table'

export default async function EventsPage() {
	const data = await getEventsData()
	return (
		<>
			<div className="flex flex-col gap-4">
				<EventsTimeline {...data} />
			</div>
			<div className="flex flex-col gap-4 pt-8">
				<EventsTable data={data.data.events} />
			</div>
		</>
	)
}
