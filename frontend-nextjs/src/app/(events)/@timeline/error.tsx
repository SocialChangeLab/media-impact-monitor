"use client";
import ErrorEventsTimeline from "@/components/EventsTimeline/ErrorEventsTimeline";

function TimelineRouteError({
	error,
	reset,
}: {
	error: unknown;
	reset?: () => void;
}) {
	const { message, details } = parseErrorMessage(error);
	return (
		<ErrorEventsTimeline
			errorMessage={message}
			errorDetails={details}
			reset={reset}
		/>
	);
}

function parseErrorMessage(error: unknown) {
	const defaultMessage = `There was unexpected issue while retrieving the protests. Please try again in a few minutes.`;
	if (error instanceof Error) {
		const [name, message] = error.message.split("&&&");
		const details =
			process.env.NODE_ENV === "development" ? message : undefined;
		if (name === "ApiFetchError")
			return {
				message: `We are facing issues with our API and where not able to retrieve the protests. Please try again in a few minutes.`,
				details,
			};
		if (name === "ZodError") {
			return {
				message: `The data returned from the API is not in the expected format. Please try again in a few minutes or contact the developers.`,
				details,
			};
		}
		return {
			message: defaultMessage,
			details,
		};
	}
	return {
		message: defaultMessage,
		details: typeof error === "string" ? error : undefined,
	};
}

export default TimelineRouteError;
