"use client";
import ComponentError from "@/components/ComponentError";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

export default function ErrorEventsTimeline({
	errorMessage,
	reset,
}: {
	errorMessage: string;
	reset?: () => void;
}) {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper animationKey="error">
				<div className="w-full h-[calc(100vh-14rem)] flex justify-center items-center bg-grayUltraLight">
					<ComponentError
						errorMessage={errorMessage}
						reset={reset}
						announcement="There was an error loading events"
					/>
				</div>
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}
