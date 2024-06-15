import type { AggregationUnitType } from "@/components/EventsTimeline/useAggregationUnit";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	differenceInCalendarISOWeeks,
	differenceInCalendarMonths,
	differenceInDays,
	differenceInYears,
	format,
	isSameDay,
	isSameMonth,
	isSameYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";
import { useMemo } from "react";

function useTimeIntervals({
	from: inputFrom,
	to: inputTo,
	aggregationUnit,
}: {
	from?: Date;
	to?: Date;
	aggregationUnit: AggregationUnitType;
}) {
	const filterStore = useFiltersStore(
		({ from, to, fromDateString, toDateString }) => ({
			from,
			to,
			fromDateString,
			toDateString,
		}),
	);
	const from = inputFrom ?? filterStore.from;
	const to = inputTo ?? filterStore.to;
	const fromDateString = inputFrom
		? format(inputFrom, "yyyy-MM-dd")
		: filterStore.fromDateString;
	const toDateString = inputTo
		? format(inputTo, "yyyy-MM-dd")
		: filterStore.toDateString;
	const range = { from, to };

	// biome-ignore lint/correctness/useExhaustiveDependencies: Using the fromDateString and toDateString to avoid the exact date (which changes on each render) to be used as dependencies of the useEffect
	const eventColumns = useMemo(() => {
		const { from, to } = range;
		if (!from || !to) return [];
		const timeComparatorFn =
			getTimeComparatorByAggregationUnit(aggregationUnit);
		const timeStartFn = getTimeStartByAggregationUnit(aggregationUnit);
		const timeIncrementerFn =
			getTimeIncrementerByAggregationUnit(aggregationUnit);
		const timeDiff = Math.abs(timeComparatorFn(to, from)) + 1;
		return new Array(timeDiff)
			.fill(null)
			.map((_, idx) => timeStartFn(timeIncrementerFn(from, idx)));
	}, [fromDateString, toDateString, aggregationUnit]);
	return eventColumns;
}

export default useTimeIntervals;

function getTimeComparatorByAggregationUnit(
	aggregationUnit: AggregationUnitType,
) {
	if (aggregationUnit === "day") return differenceInDays;
	if (aggregationUnit === "week") return differenceInCalendarISOWeeks;
	if (aggregationUnit === "month") return differenceInCalendarMonths;
	return differenceInYears;
}

function getTimeStartByAggregationUnit(aggregationUnit: AggregationUnitType) {
	if (aggregationUnit === "day") return startOfDay;
	if (aggregationUnit === "week")
		return (d: Date | string) => startOfWeek(d, { weekStartsOn: 1 });
	if (aggregationUnit === "month") return startOfMonth;
	return startOfYear;
}

function getTimeIncrementerByAggregationUnit(
	aggregationUnit: AggregationUnitType,
) {
	if (aggregationUnit === "day") return addDays;
	if (aggregationUnit === "week") return addWeeks;
	if (aggregationUnit === "month") return addMonths;
	return addYears;
}

export function isInSameAggregationUnit(
	aggregationUnit: AggregationUnitType,
	d1: Date,
	d2: Date,
) {
	if (aggregationUnit === "day") return isSameDay(d1, d2);
	if (aggregationUnit === "week") return perfIsSameWeek(d1, d2);
	if (aggregationUnit === "month") return isSameMonth(d1, d2);
	return isSameYear(d1, d2);
}

function getStartOfWeek(date: Date) {
	const day = date.getUTCDay();
	const diff = (day === 0 ? -6 : 1) - day;
	date.setUTCDate(date.getUTCDate() + diff);
	date.setUTCHours(0, 0, 0, 0);
	return date;
}

function perfIsSameWeek(d1: Date, d2: Date) {
	const startOfWeek1 = getStartOfWeek(d1);
	const startOfWeek2 = getStartOfWeek(d2);
	return startOfWeek1.getTime() === startOfWeek2.getTime();
}
