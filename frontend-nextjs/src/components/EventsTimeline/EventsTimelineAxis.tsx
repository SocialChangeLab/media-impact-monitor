import { cn } from "@/utility/classNames";
import type { ComparableDateItemType } from "@/utility/comparableDateItemSchema";
import { memo, useMemo } from "react";
import {
	type AggregationUnitType,
	formatDateByAggregationUnit,
} from "./useAggregationUnit";

function EventsTimelineAxis({
	eventColumns,
	aggregationUnit,
	width,
}: {
	eventColumns: ComparableDateItemType[];
	aggregationUnit: AggregationUnitType;
	width: number;
}) {
	if (eventColumns.length === 0) return null;

	const idxsWithTicks = useMemo(
		() => getIdxsWithTicks(eventColumns.length, width),
		[eventColumns.length, width],
	);

	return (
		<div className="sticky bottom-0 w-full z-10">
			<ul
				aria-label="X Axis - Time"
				className={cn(
					"flex items-start pb-6 h-14 bg-pattern-soft",
					"relative justify-stretch overflow-clip",
				)}
				style={{ width: `max(${eventColumns.length + 1}rem, 100%)` }}
			>
				{eventColumns.map(({ date, time }, idx) => {
					const showLabel = idxsWithTicks.includes(idx);
					return (
						<li
							key={time}
							className="flex min-w-4 bg-pattern-soft h-14 justify-center relative shrink-0 grow border-t border-grayMed"
							aria-label="X Axis Tick"
						>
							<span
								className={cn(
									"w-px h-2 absolute left-1/2 -translate-x-1/2 z-10",
									showLabel ? "bg-grayDark" : "bg-grayLight",
								)}
								aria-hidden="true"
							/>
							<span
								className={cn(
									"absolute left-1/2 top-4 z-10 -translate-x-1/2 text-grayDark text-sm whitespace-nowrap",
									idx === 0 && "translate-x-0",
									idx === eventColumns.length - 1 && "-translate-x-full",
								)}
							>
								{showLabel &&
									formatDateByAggregationUnit(date, aggregationUnit)}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export function getIdxsWithTicks(columnCount: number, width: number) {
	const labelWidth = 400;
	const maxDivider = Math.round(width / labelWidth);
	if (columnCount === 0) return [];
	if (columnCount === 1) return [0];
	if (columnCount === 2) return [0, 1];
	if (columnCount === 3) return [0, 1, 2];
	const part = Math.round(columnCount / maxDivider - 1);
	return [
		0,
		...Array(Math.max(0, maxDivider))
			.fill(null)
			.map((_, i) => i * part),
		columnCount - 1,
	];
}

export default memo(EventsTimelineAxis);
