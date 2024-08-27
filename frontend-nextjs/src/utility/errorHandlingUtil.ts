export function parseErrorMessage(error: unknown, dataName = "data") {
	const defaultMessage = `There was unexpected issue while retrieving the ${dataName}. Please try again in a few minutes.`;
	const errorString =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: "";
	const [name, message] = errorString.split("&&&");
	const details = process.env.NODE_ENV === "development" ? message : undefined;
	if (name === "ApiFetchError")
		return {
			message: `We are facing issues with our API and where not able to retrieve the ${dataName}. Please try again in a few minutes.`,
			details,
		};
	if (name === "ZodError") {
		return {
			message: `The ${dataName} returned from the API are/is not in the expected format. Please try again in a few minutes or contact the developers.`,
			details,
		};
	}
	return {
		message: defaultMessage,
		details,
	};
}
