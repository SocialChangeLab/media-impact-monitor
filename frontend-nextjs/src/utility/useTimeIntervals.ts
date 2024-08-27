import type { AggregationUnitType } from "@/components/EventsTimeline/useAggregationUnit";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	differenceInCalendarISOWeeks,
	differenceInCalendarMonths,
	differenceInDays,
	differenceInYears,
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";
import { useMemo } from "react";
import {
	type ComparableDateItemType,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { format } from "./dateUtil";

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
	const { today } = useToday();

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
			.map((_, idx) =>
				dateToComparableDateItem(
					timeStartFn(timeIncrementerFn(from, idx)),
					today,
				),
			);
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

export function getDateRangeByAggregationUnit({
	aggregationUnit,
	date,
}: {
	aggregationUnit: AggregationUnitType;
	date: Date;
}) {
	if (aggregationUnit === "week")
		return {
			from: startOfWeek(date, { weekStartsOn: 1 }),
			to: endOfWeek(date, { weekStartsOn: 1 }),
		};
	if (aggregationUnit === "month")
		return { from: startOfMonth(date), to: endOfMonth(date) };
	if (aggregationUnit === "year")
		return { from: startOfYear(date), to: endOfYear(date) };
	return { from: startOfDay(date), to: endOfDay(date) };
}

export function isInSameAggregationUnit(
	aggregationUnit: AggregationUnitType,
	comparableDateItem: ComparableDateItemType,
	date: Date,
) {
	if (aggregationUnit === "day")
		return comparableDateItem.time === date.getTime();
	if (aggregationUnit === "week")
		return comparableDateItem.week === date.getTime();
	if (aggregationUnit === "month")
		return (
			comparableDateItem.month === date.getUTCMonth() &&
			comparableDateItem.year === date.getUTCFullYear()
		);
	return comparableDateItem.year === date.getUTCFullYear();
}
