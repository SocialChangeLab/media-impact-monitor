"use client";
import ErrorEventsTimeline from "@/components/EventsTimeline/ErrorEventsTimeline";
import { ApiFetchError } from "@/utility/eventsUtil";

function TimelineRouteError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset?: () => void;
}) {
	const message = parseErrorMessage(error);
	return <ErrorEventsTimeline errorMessage={message} reset={reset} />;
}

function parseErrorMessage(error: unknown) {
	if (error instanceof ApiFetchError)
		return `We are facing issues with our API and where not able to retrieve the events. Please try again in a few minutes.`;
	if (error instanceof Error)
		return `There was an issue with the event data: ${error.message}. Please try again in a few minutes.`;
	if (typeof error === "string")
		return `There was an issue with the event data: ${error}. Please try again in a few minutes.`;
	return `There was an issue with the event data. Please try again in a few minutes.`;
}

export default TimelineRouteError;
