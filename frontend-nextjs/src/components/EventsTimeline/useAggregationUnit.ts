import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import {
	differenceInCalendarISOWeeks,
	differenceInCalendarMonths,
	differenceInDays,
} from "date-fns";
import { useMemo } from "react";
import config from "./eventsTimelineConfig";

export type AggregationUnitType = "day" | "week" | "month" | "year";

function useAggregationUnit(parentWidth: number): AggregationUnitType {
	const range = useFiltersStore(({ from, to }) => ({ from, to }));

	const aggregationUnit = useMemo(
		() => getAggregationUnitByRange(range, parentWidth),
		[parentWidth, range],
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
