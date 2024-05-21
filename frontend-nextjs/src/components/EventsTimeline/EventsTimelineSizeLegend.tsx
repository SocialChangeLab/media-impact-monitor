import { cn } from "@/utility/classNames";
import type { ScalePower } from "d3-scale";
import { Fragment, useMemo } from "react";
import type { AggregationUnitType } from "./useAggregationUnit";

function EventsTimelineSizeLegend({
	sizeScale,
	aggragationUnit,
}: {
	sizeScale: ScalePower<number, number>;
	aggragationUnit: AggregationUnitType;
}) {
	const exampleSizes = useMemo(() => {
		const max = roundLegendNumber(Math.max(sizeScale.domain()[1], 30));
		const min = getLegendMinNumber(max);
		const mid = roundLegendNumber(Math.floor((min + max) / 2));
		return [undefined, min, mid, max].map((x, idx) => ({
			id: idx,
			size: x,
			height: sizeScale(x ?? 0),
		}));
	}, [sizeScale]);
	const isAggregated = aggragationUnit !== "day";

	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold">Size</h5>
			<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
				{exampleSizes.map(({ id, size, height }) => (
					<Fragment key={id}>
						<div
							className={cn(
								"bg-grayDark w-3",
								isAggregated ? "rounded-sm" : "rounded-full",
							)}
							style={{ height }}
						/>
						<span>
							{size ? size.toLocaleString("en-GB") : "0 or unknown"}{" "}
							{aggragationUnit === "day" ? "protest" : `${aggragationUnit}ly`}{" "}
							participants
						</span>
					</Fragment>
				))}
			</div>
		</div>
	);
}

export default EventsTimelineSizeLegend;

function getLegendMinNumber(maxNumber: number) {
	if (maxNumber < 1000) return 10;
	if (maxNumber < 10000) return 100;
	if (maxNumber < 100000) return 1000;
	return 100000;
}

function roundLegendNumber(num: number, rounder = Math.floor) {
	if (num < 100) return rounder(num / 10) * 10;
	if (num < 1000) return rounder(num / 100) * 100;
	if (num < 10000) return rounder(num / 1000) * 1000;
	if (num < 100000) return rounder(num / 10000) * 10000;
	return rounder(num / 100000) * 100000;
}
