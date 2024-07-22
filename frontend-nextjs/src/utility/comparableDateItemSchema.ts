import { parse, startOfDay, startOfWeek } from "date-fns";
import { z } from "zod";

export const comparableDateItemSchema = z.object({
	date: z.date(),
	year: z.number(),
	month: z.number(),
	week: z.number(),
	day: z.number(),
	time: z.number(),
});
export type ComparableDateItemType = z.infer<typeof comparableDateItemSchema>;

const today = new Date();
export const dateToComparableDateItem = (d: Date | string) => {
	const date = startOfDay(
		typeof d === "string" ? parse(d, "yyyy-MM-dd", today) : d,
	);
	return {
		date,
		year: date.getUTCFullYear(),
		month: date.getUTCMonth(),
		week: startOfWeek(date, { weekStartsOn: 1 }).getTime(),
		day: date.getUTCDate(),
		time: date.getTime(),
	};
};
