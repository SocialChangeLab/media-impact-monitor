import { cn } from "@/utility/classNames";
import { format } from "date-fns";
import { memo } from "react";
import {
	formatDateByAggregationUnit,
	type AggregationUnitType,
} from "./EventsTimeline/useAggregationUnit";

function TopicChartTooltip({
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
			<strong className="font-bold font-headlines text-base leading-tight pb-2 mb-2 border-b border-grayLight min-w-56">
				{aggregationUnit !== "day" &&
					`${aggregationUnit.charAt(0).toUpperCase()}${aggregationUnit.slice(
						1,
					)} of `}
				{aggregationUnit === "day" && format(item.date, "EEEE d MMMM yyyy")}
				{aggregationUnit === "month"
					? format(item.date, "MMMM yyyy")
					: formatDateByAggregationUnit(item.date, aggregationUnit)}
			</strong>
			{topics
				.map((t) => ({ ...t, value: item[t.topic] }))
				.map(({ topic, value, color }) => (
					<div
						key={topic}
						className="grid grid-cols-[auto_1fr_auto] gap-2 items-center text-sm"
					>
						<span className="size-3" style={{ background: color }} />
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
			<div className="border-t border-grayLight pt-1 mt-1 flex gap-4 justify-between items-center">
				<strong className="font-bold ">Total:</strong>
				<span className="font-mono text-xs text-grayDark">
					{/* biome-ignore lint/correctness/useJsxKeyInIterable: <explanation> */}
					{topics.reduce((acc, { topic }) => acc + (item[topic] || 0), 0)}
				</span>
			</div>
		</div>
	);
}

export default memo(TopicChartTooltip);
