"use client";
import type { MediaSentimentType } from "@/utility/mediaSentimentUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useElementSize from "@custom-react-hooks/use-element-size";
import { useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import useAggregationUnit, {
	formatDateByAggregationUnit,
} from "./EventsTimeline/useAggregationUnit";

function MediaSentimentChart({
	data,
}: {
	data: MediaSentimentType[];
}) {
	const [parentRef, size] = useElementSize();
	const aggregationUnit = useAggregationUnit(size.width);
	const intervals = useTimeIntervals(aggregationUnit);

	const isInSameUnit = useCallback(
		(a: Date, b: Date) => isInSameAggregationUnit(aggregationUnit, a, b),
		[aggregationUnit],
	);

	const { filteredData, topics } = useMemo(() => {
		const allTopics = Array.from(
			data
				.reduce((acc, day) => {
					acc.add(day.topic);
					return acc;
				}, new Set<string>())
				.values(),
		);
		return {
			topics: allTopics.sort(),
			filteredData: intervals.map((d) => {
				const daysInUnit = data.filter((day) =>
					isInSameUnit(new Date(day.date), d),
				);
				return allTopics.reduce(
					(acc, topic) => {
						const itemsWithTopics = daysInUnit.filter(
							(day) => day.topic === topic,
						);
						const sum = itemsWithTopics.reduce(
							(acc, day) => acc + (day.n_articles || 0),
							0,
						);
						acc[topic] = sum;
						return acc;
					},
					{
						date: d,
						dateFormatted: formatDateByAggregationUnit(d, aggregationUnit),
					} as Record<string, string | number | Date>,
				);
			}),
		};
	}, [data, intervals, isInSameUnit, aggregationUnit]);

	return (
		<div
			className="w-full h-[var(--media-sentiment-chart-height)]"
			ref={parentRef}
		>
			<BarChart
				width={size.width}
				height={size.height}
				data={filteredData}
				margin={{
					top: 0,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid
					stroke="var(--grayLight)"
					fill="var(--grayUltraLight)"
					horizontal={false}
				/>
				<XAxis
					dataKey="dateFormatted"
					stroke="var(--grayDark)"
					strokeWidth={0.25}
					fontSize="0.875rem"
				/>
				<YAxis
					stroke="var(--grayDark)"
					strokeWidth={0.25}
					fontSize="0.875rem"
				/>
				<Tooltip
					formatter={(value) => `${value} articles`}
					cursor={{ fill: "var(--bgOverlay)", fillOpacity: 0.1 }}
					content={({ payload, active }) => {
						if (!active || !payload) return null;
						const item = payload[0]?.payload;
						if (!item) return null;
						const { date } = item;

						return (
							<div className="bg-bg border border-grayMed p-4 flex flex-col gap-1">
								<strong className="font-bold font-headlines">
									{" "}
									{formatDateByAggregationUnit(date, aggregationUnit)}
								</strong>
								{[...topics]
									.reverse()
									.map((topic) => ({ topic, value: item[topic] }))
									.map(({ topic, value }, idx) => (
										<div key={topic} className="flex gap-2 items-center">
											<span
												className="size-3 rounded-full"
												style={{
													background: `var(--categorical-color-${
														topics.length - idx
													})`,
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
					}}
				/>
				{topics.map((topic, idx) => (
					<Bar
						key={topic}
						type="monotone"
						dataKey={topic}
						stackId="topic"
						stroke={`var(--categorical-color-${idx + 1})`}
						fill={`var(--categorical-color-${idx + 1})`}
					/>
				))}
			</BarChart>
		</div>
	);
}

export default MediaSentimentChart;
