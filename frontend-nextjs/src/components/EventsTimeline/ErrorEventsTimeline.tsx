"use client";
import ComponentError from "@/components/ComponentError";
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
				<div className="w-full h-[calc(100vh-14rem)] flex justify-center items-center bg-grayUltraLight border border-grayLigh">
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
