import EventsTimelineWrapper from './EventsTimelinWrapper'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'

export default function EmptyEventsTimeline() {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper>
				No events for this search configuration
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	)
}
