import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

export default function EmptyEventsTimeline() {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper animationKey="empty">
				No events for this search configuration
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}
