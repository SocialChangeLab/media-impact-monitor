'use client'
import { Query, type EventDataType } from '@utility/eventsUtil'
import useEvents from '@utility/useEvents'
import EventsTimeline from './EventTimeline'

function EventsTimelineWithState(initialData: Query<EventDataType>) {
	const { data } = useEvents(initialData)

	return (
		<EventsTimeline
			events={data?.events ?? []}
			organisations={data?.organisations ?? []}
		/>
	)
}

export default EventsTimelineWithState
