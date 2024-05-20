"use client";
import ComponentError from "@/components/ComponentError";
import { cn } from "@/utility/classNames";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

export default function ErrorEventsTimeline({
	errorMessage,
	errorDetails,
	reset,
}: {
	errorMessage: string;
	errorDetails?: string;
	reset?: () => void;
}) {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper animationKey="error">
				<div
					className={cn(
						"w-full h-[var(--protest-timeline-height)]",
						"flex justify-center items-center",
						"bg-grayUltraLight border border-grayLight",
					)}
				>
					<ComponentError
						errorMessage={errorMessage}
						reset={reset}
						errorDetails={errorDetails}
					/>
				</div>
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}
