import { cn } from "@/utility/classNames";
import { memo } from "react";
import {
	formatDateByAggregationUnit,
	type AggregationUnitType,
} from "../EventsTimeline/useAggregationUnit";

function MediaCoverageChartTooltip({
	aggregationUnit,
	topics,
	item,
}: {
	aggregationUnit: AggregationUnitType;
	topics: {
		topic: string;
		color: string;
		sum: number;
	}[];
	item: Record<string, number> & {
		date: Date;
	};
}) {
	return (
		<div
			className={cn(
				"bg-bg border border-grayMed p-4 flex flex-col gap-1",
				"shadow-lg shadow-black/5 dark:shadow-black/50",
			)}
		>
			<strong className="font-bold font-headlines text-base leading-tight pb-2 mb-2 border-b border-grayLight min-w-40">
				{formatDateByAggregationUnit(item.date, aggregationUnit)}
			</strong>
			{topics
				.map(({ topic, color }) => ({ topic, value: item[topic], color }))
				.map(({ topic, value, color }, idx) => (
					<div
						key={topic}
						className="grid grid-cols-[auto_1fr_auto] gap-2 items-center text-sm"
					>
						<span
							className="size-3 rounded-full"
							style={{ background: color }}
						/>
						<strong className="font-bold">
							{topic.charAt(0).toUpperCase()}
							{topic.slice(1)}
							{": "}
						</strong>
						<span className="font-mono text-xs text-grayDark">
							{(+value)?.toLocaleString("en-GB") ?? 0}
						</span>
					</div>
				))}
		</div>
	);
}

export default memo(MediaCoverageChartTooltip);
