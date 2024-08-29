import { format as dateFnsFormat, isBefore, parse } from "date-fns";
import { today } from "./today";

export function dateSortCompare(a: unknown, b: unknown): 0 | -1 | 1 {
	if (typeof a !== "string" || typeof b !== "string") return 0;
	try {
		const dateA = new Date(a);
		const dateB = new Date(b);
		if (isBefore(dateA, dateB)) return -1;
		if (isBefore(dateB, dateA)) return 1;
		return 0;
	} catch (error) {
		return 0;
	}
}

export function isValidISODateString(date?: unknown) {
	if (typeof date !== "string") return false;
	try {
		parse(date, "yyyy-MM-dd", today);
		return true;
	} catch (error) {
		return false;
	}
}

export function format(...props: Parameters<typeof dateFnsFormat>) {
	return dateFnsFormat(...props);
}
