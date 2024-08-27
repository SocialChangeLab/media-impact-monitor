import { cn } from "@/utility/classNames";
import type { ScaleLinear } from "d3-scale";
import { ArrowRight } from "lucide-react";
import { memo, useMemo } from "react";
import type { AggregationUnitType } from "./useAggregationUnit";

function EventsTimelineSizeLegend({
	sizeScale,
	aggragationUnit,
}: {
	sizeScale: ScaleLinear<number, number, never>;
	aggragationUnit: AggregationUnitType;
}) {
	const exampleSizes = useMemo(() => {
		const maxVal = Math.max(sizeScale.domain()[1], 30);
		const max = roundLegendNumber(maxVal);
		let min = roundLegendNumber(maxVal / 2);
		min = min === max ? max / 2 : min;
		return [undefined, min, max].map((x, idx) => ({
			id: idx,
			size: x,
			height: sizeScale(x ?? 0),
		}));
	}, [sizeScale]);
	const isAggregated = aggragationUnit !== "day";

	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold flex gap-1 items-center">
				<span>Size</span>
				<ArrowRight size={16} className="text-grayDark" />
				<span>
					{aggragationUnit === "day"
						? "Protest"
						: `${aggragationUnit
								.charAt(0)
								.toUpperCase()}${aggragationUnit.slice(1)}ly`}{" "}
					participants
				</span>
			</h5>
			<div className="flex flex-row-reverse items-start justify-end gap-y-1 h-48">
				{exampleSizes.map(({ id, size, height }) => (
					<div className="flex gap-2 items-end" key={id}>
						<div
							className={cn(
								"bg-grayDark w-3",
								isAggregated ? "rounded-sm" : "rounded-full",
							)}
							style={{ height }}
						/>
						<span className="h-px relative w-px">
							<span
								className={cn(
									"absolute left-0 text-nowrap h-3.5",
									size ? "-translate-y-1/2 top-1/2" : "top-0 -translate-y-full",
								)}
							>
								{size ? size.toLocaleString("en-GB") : "0 or unknown"}{" "}
							</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(EventsTimelineSizeLegend);

function roundLegendNumber(num: number, rounder = Math.floor) {
	if (num < 100) return rounder(num / 10) * 10;
	if (num < 1000) return rounder(num / 100) * 100;
	if (num < 10000) return rounder(num / 1000) * 1000;
	if (num < 100000) return rounder(num / 10000) * 10000;
	return rounder(num / 100000) * 100000;
}
