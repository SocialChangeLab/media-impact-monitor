"use client";
import ComponentError from "@/components/ComponentError";
import { cn } from "@/utility/classNames";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

export default function ErrorEventsTimeline({
	message,
	details,
	reset,
}: {
	message: string;
	details?: string;
	reset?: () => void;
}) {
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
					<ComponentError
						errorMessage={message}
						reset={reset}
						errorDetails={details}
					/>
				</div>
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}
