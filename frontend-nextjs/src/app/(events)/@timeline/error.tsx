"use client";
import ErrorEventsTimeline from "@/components/EventsTimeline/ErrorEventsTimeline";

function TimelineRouteError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset?: () => void;
}) {
	return <ErrorEventsTimeline errorMessage={error.message} reset={reset} />;
}

export default TimelineRouteError;
