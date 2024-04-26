'use client'
import { type EventsDataType } from '@utility/eventsUtil'
import useEvents from '@utility/useEvents'
import EmptyEventsTimeline from './EmptyEventsTimeline'
import ErrorEventsTimeline from './ErrorEventsTimeline'
import EventsTimeline from './EventsTimeline'
import LoadingEventsTimeline from './LoadingEventsTimeline'

function EventsTimelineWithState(initialData: EventsDataType) {
	const { data, isPending, error } = useEvents(initialData)

	if (error) return <ErrorEventsTimeline errorMessage={error?.message} />
	if (isPending) return <LoadingEventsTimeline />
	if (data?.events.length === 0) return <EmptyEventsTimeline />
	return (
		<EventsTimeline
			events={data?.events ?? []}
			organisations={data?.organisations ?? []}
		/>
	)
}

export default EventsTimelineWithState
