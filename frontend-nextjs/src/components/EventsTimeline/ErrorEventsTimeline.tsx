import ComponentError from '@components/ComponentError'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'

export default function ErrorEventsTimeline({
	errorMessage,
	reset,
}: {
	errorMessage: string
	reset?: () => void
}) {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper>
				<ComponentError
					errorMessage={errorMessage}
					reset={reset}
					announcement="There was an error loading events"
				/>
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	)
}
