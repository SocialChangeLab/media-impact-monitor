import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { format } from "@/utility/dateUtil";
import {
	differenceInCalendarISOWeeks,
	differenceInCalendarMonths,
	differenceInDays,
	endOfWeek,
	isSameMonth,
	isSameYear,
	startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import config from "./eventsTimelineConfig";

export type AggregationUnitType = "day" | "week" | "month" | "year";

function useAggregationUnit(parentWidth: number): AggregationUnitType {
	const range = useFiltersStore(
		({ from, to, fromDateString, toDateString }) => ({
			from,
			to,
			fromDateString,
			toDateString,
		}),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: using the fromDateString and toDateString to avoid the exact date (which changes on each render) to be used as dependencies of the useMemo
	const aggregationUnit = useMemo(
		() =>
			getAggregationUnitByRange(
				{
					from: range.from,
					to: range.to,
				},
				parentWidth,
			),
		[parentWidth, range.fromDateString, range.toDateString],
	);

	return aggregationUnit;
}

export default useAggregationUnit;

function getAggregationUnitByRange(
	range: {
		from: Date;
		to: Date;
	},
	width: number,
): AggregationUnitType {
	if (width === 0) return "day";
	const { from, to } = range;
	const fittableColumnsCount = Math.floor(width / config.eventColumnWidth);
	const amountDays = Math.abs(differenceInDays(from, to));
	if (amountDays <= fittableColumnsCount) return "day";
	const amountISOWeeks = Math.abs(differenceInCalendarISOWeeks(from, to));
	if (amountISOWeeks <= fittableColumnsCount) return "week";
	const amountMonths = Math.abs(differenceInCalendarMonths(from, to));
	if (amountMonths <= fittableColumnsCount) return "month";
	return "year";
}

export function formatDateByAggregationUnit(
	date: Date,
	aggregationUnit: AggregationUnitType,
) {
	if (aggregationUnit === "day") return format(date, "EEE d.M.yyyy");
	if (aggregationUnit === "week") {
		const start = startOfWeek(date, { weekStartsOn: 1 });
		const end = endOfWeek(date, { weekStartsOn: 1 });
		const startAndEndOnSameMonth = isSameMonth(start, end);
		const startAndEndOnSameYear = isSameYear(start, end);
		const formatStart = [
			"d",
			!startAndEndOnSameMonth && " MMM",
			!startAndEndOnSameYear && " yyyy",
		]
			.filter(Boolean)
			.join("");
		return `${format(start, formatStart)} - ${format(end, "d MMM yyyy")}`;
	}
	if (aggregationUnit === "month") return format(date, "MMM yyyy");
	return format(date, "yyyy");
}
