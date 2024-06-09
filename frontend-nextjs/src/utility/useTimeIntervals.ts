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
	isSameDay,
	isSameMonth,
	isSameWeek,
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
	const filterStore = useFiltersStore(({ from, to }) => ({ from, to }));
	const from = inputFrom ?? filterStore.from;
	const to = inputTo ?? filterStore.to;
	const range = { from, to };

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
	}, [range, aggregationUnit]);
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
	if (aggregationUnit === "week")
		return isSameWeek(d1, d2, { weekStartsOn: 1 });
	if (aggregationUnit === "month") return isSameMonth(d1, d2);
	return isSameYear(d1, d2);
}
