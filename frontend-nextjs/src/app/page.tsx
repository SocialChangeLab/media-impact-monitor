import { BaseLayout } from '@components/BaseLayout'
import EventsTimeline from '@components/EventsTimeline'
import { getEventsData } from '@utility/eventsUtil'
import EventsTable from './table'

export default async function EventPage() {
	const data = await getEventsData()
	return (
		<BaseLayout currentPage="events">
			<div className="px-6 pt-8 pb-16">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold font-headlines antialiased">
						{'Events'}
					</h1>
				</div>
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-4">
						<EventsTimeline {...data} />
					</div>
					<div className="flex flex-col gap-4 pt-8">
						<EventsTable data={data.data.events} />
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
