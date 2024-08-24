import {
	getDay,
	getMonth,
	getTime,
	getYear,
	parse,
	startOfDay,
	startOfWeek,
} from "date-fns";
import { z } from "zod";
import { today as defaultToday } from "./today";

export const comparableDateItemSchema = z.object({
	date: z.date(),
	year: z.number(),
	month: z.number(),
	week: z.number(),
	day: z.number(),
	time: z.number(),
});
export type ComparableDateItemType = z.infer<typeof comparableDateItemSchema>;

export const dateToComparableDateItem = (
	d: Date | string,
	today = defaultToday,
) => {
	const date = startOfDay(
		typeof d === "string" ? parse(d, "yyyy-MM-dd", today) : d,
	);
	const dateObj = {
		date,
		year: getYear(date),
		month: getMonth(date),
		week: getTime(startOfWeek(date, { weekStartsOn: 1 })),
		day: getDay(date),
		time: getTime(date),
	};
	return dateObj;
};
