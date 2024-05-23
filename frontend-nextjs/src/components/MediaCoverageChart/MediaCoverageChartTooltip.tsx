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
		<div className="bg-bg border border-grayMed p-4 flex flex-col gap-1">
			<strong className="font-bold font-headlines text-lg leading-tight pb-2">
				{formatDateByAggregationUnit(item.date, aggregationUnit)}
			</strong>
			{[...topics]
				.reverse()
				.map(({ topic }) => ({ topic, value: item[topic] }))
				.map(({ topic, value }, idx) => (
					<div key={topic} className="flex gap-2 items-center text-sm">
						<span
							className="size-3 rounded-full"
							style={{
								background: `var(--categorical-color-${topics.length - idx})`,
							}}
						/>
						<strong className="font-bold">
							{topic.charAt(0).toUpperCase()}
							{topic.slice(1)}
							{": "}
						</strong>
						{(+value)?.toLocaleString("en-GB") ?? 0}
					</div>
				))}
		</div>
	);
}

export default memo(MediaCoverageChartTooltip);
