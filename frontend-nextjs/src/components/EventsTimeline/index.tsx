'use client'
import useEvents from '@/utility/useEvents'
import EventsTimeline from './EventsTimeline'

function EventsTimelineWithState() {
	const { data } = useEvents()

	return (
		<EventsTimeline
			events={data?.events ?? []}
			organisations={data?.organisations ?? []}
		/>
	)
}

export default EventsTimelineWithState
