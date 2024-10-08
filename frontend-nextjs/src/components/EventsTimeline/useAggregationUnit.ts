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
	const from = useFiltersStore(({ from }) => from)
	const to = useFiltersStore(({ to }) => to)
	const fromDateString = useFiltersStore(({ fromDateString }) => fromDateString)
	const toDateString = useFiltersStore(({ toDateString }) => toDateString)

	const aggregationUnit = useMemo(
		() =>
			getAggregationUnitByRange(
				{ from, to },
				parentWidth,
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[parentWidth, fromDateString, toDateString],
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
