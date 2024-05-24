import { cn } from "@/utility/classNames";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

export default function EmptyEventsTimeline() {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper>
				<div
					className={cn(
						"w-full h-[var(--protest-timeline-height)]",
						"flex justify-center items-center",
						"bg-grayUltraLight border border-grayLight",
					)}
				>
					<p>No data for the current filter configuration</p>
				</div>
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}
