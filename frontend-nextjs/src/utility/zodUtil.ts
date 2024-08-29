import { ZodError } from "zod";

export function formatZodError(error: unknown) {
	if (error instanceof ZodError) {
		const errorMessage = (error.issues ?? [])
			.map(
				(x) =>
					`${x.message}${x.path.length > 0 ? ` at ${x.path.join(".")}` : ""}`,
			)
			.join(", ");
		return `ZodError&&&${errorMessage}`;
	}
	if (error instanceof Error) {
		return `${error.name}&&&${error.name}`;
	}
	return `UnknownError&&&${error}`;
}
