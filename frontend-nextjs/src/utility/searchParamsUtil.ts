import { defaultFrom, defaultTo } from "@/app/(events)/config";
import { format, parse } from "date-fns";
export type AllowedParamsInputType = {
	from?: Date | undefined;
	to?: Date | undefined;
};

export function parseSearchParams(
	originalSearchParams: URLSearchParams,
): AllowedParamsInputType {
	const from = originalSearchParams.get("from");
	const to = originalSearchParams.get("to");
	return {
		from:
			typeof from === "string"
				? parse(from, "yyyy-MM-dd", new Date())
				: new Date(defaultFrom),
		to:
			typeof to === "string"
				? parse(to, "yyyy-MM-dd", new Date())
				: new Date(defaultTo),
	};
}

export function formatSearchParams(
	searchParams: AllowedParamsInputType,
): URLSearchParams {
	const { from, to } = searchParams;
	return new URLSearchParams({
		from: from ? format(from, "yyyy-MM-dd") : defaultFrom,
		to: to ? format(to, "yyyy-MM-dd") : defaultTo,
	});
}
