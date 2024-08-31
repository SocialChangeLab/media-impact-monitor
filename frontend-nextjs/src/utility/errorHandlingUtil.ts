import { texts } from "./textUtil";

export function parseErrorMessage(error: unknown, datasetName = "data") {
	const errorString =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: "";
	const [name, message] = errorString.split("&&&");
	const details = process.env.NODE_ENV === "development" ? message : undefined;
	const defaultMessageFn = texts.errors.apiErrorTranslations.defaultMessage;
	const originalMessageFn =
		texts.errors.apiErrorTranslations[
			name as keyof typeof texts.errors.apiErrorTranslations
		];
	const originalDetailsFn =
		texts.errors.apiErrorTranslations[
			details as keyof typeof texts.errors.apiErrorTranslations
		];
	const messageFn = originalMessageFn ?? defaultMessageFn;
	const detailsFn = originalDetailsFn ?? (() => details);
	return {
		message: messageFn({ datasetName }),
		details: detailsFn({ datasetName }),
	};
}
