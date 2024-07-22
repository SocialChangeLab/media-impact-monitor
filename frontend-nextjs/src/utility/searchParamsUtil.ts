import { z } from "zod";

const stringDateZodSchema = z.coerce.date().optional();

export function parseSearchParamsFilters(searchParams?: {
	[key: string]: string | string[] | undefined;
}) {
	if (
		!searchParams ||
		!("filters" in searchParams) ||
		typeof searchParams.filters !== "string"
	)
		return { from: undefined, to: undefined };
	try {
		const parsed = JSON.parse(JSON.parse(searchParams.filters));
		return z
			.object({ from: stringDateZodSchema, to: stringDateZodSchema })
			.parse(parsed.state);
	} catch (error) {
		return { from: undefined, to: undefined };
	}
}
