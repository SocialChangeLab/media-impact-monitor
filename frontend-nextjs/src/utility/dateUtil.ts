import { format as dateFnsFormat, isBefore, parse } from "date-fns";

export function dateSortCompare(a: unknown, b: unknown, today: Date): 0 | -1 | 1 {
	if (typeof a !== "string" || typeof b !== "string") return 0;
	try {
		const dateA = parse(a, "yyyy-MM-dd", today);
		const dateB = parse(b, "yyyy-MM-dd", today);
		if (isBefore(dateA, dateB)) return -1;
		if (isBefore(dateB, dateA)) return 1;
		return 0;
	} catch (error) {
		return 0;
	}
}

export function format(...props: Parameters<typeof dateFnsFormat>) {
	return dateFnsFormat(...props);
}
