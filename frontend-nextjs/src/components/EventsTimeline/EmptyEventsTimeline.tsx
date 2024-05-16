import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

export default function EmptyEventsTimeline() {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper animationKey="empty">
				<div className="w-full h-[calc(100vh-14rem)] flex justify-center items-center bg-grayUltraLight border border-grayLight">
					<p>No data for the current filter configuration</p>
				</div>
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}
