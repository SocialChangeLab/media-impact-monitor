"use client";
import ErrorEventsTimeline from "@/components/EventsTimeline/ErrorEventsTimeline";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";

function TimelineRouteError({
	error,
	reset,
}: {
	error: unknown;
	reset?: () => void;
}) {
	const { message, details } = parseErrorMessage(error, "protests");
	return (
		<ErrorEventsTimeline
			errorMessage={message}
			errorDetails={details}
			reset={reset}
		/>
	);
}

export default TimelineRouteError;
