"use client";
import type { MediaSentimentType } from "@/utility/mediaSentimentUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useElementSize from "@custom-react-hooks/use-element-size";
import { memo, useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import useAggregationUnit, {
	formatDateByAggregationUnit,
} from "@/components/EventsTimeline/useAggregationUnit";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import useMediaSentimentData from "@/utility/useMediaSentiment";
import EmptyEventsTimeline from "../EventsTimeline/EmptyEventsTimeline";
import TopicChartTooltip from "../TopicChartTooltip";
import MediaSentimentChartError from "./MediaSentimentChartError";
import MediaSentimentChartLegend from "./MediaSentimentChartLegend";
import MediaSentimentChartLoading from "./MediaSentimentChartLoading";

const MediaSentimentChart = memo(
	({
		data,
	}: {
		data: MediaSentimentType[];
	}) => {
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
			const filteredData = intervals.map((d) => {
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
					} as {
						date: Date;
						dateFormatted: string;
					} & {
						[key: string]: number;
					},
				);
			});
			return {
				topics: allTopics.sort().map((topic) => ({
					topic,
					color: `var(--sentiment-${topic})`,
					sum: filteredData.reduce((acc, day) => acc + day[topic], 0),
				})),
				filteredData,
			};
		}, [data, intervals, isInSameUnit, aggregationUnit]);

		return (
			<div className="media-sentiment-chart">
				<style jsx global>{`
				.media-sentiment-chart .recharts-cartesian-grid-vertical {
					transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
					opacity: 0 !important;
				}
				.media-sentiment-chart svg:hover .recharts-cartesian-grid-vertical {
					opacity: 1 !important;
				}
				.media-sentiment-chart:has(.legend-topic:hover) .media-sentiment-item {
					opacity: 0.2 !important;
					filter: grayscale(100%) !important;
				}
				${topics
					.map(({ topic }) => {
						const slug = slugifyCssClass(topic);
						return `
							.media-sentiment-chart:has(.legend-topic-${slug}:hover)
								.media-sentiment-item-topic-${slug} {
									opacity: 1 !important;
									filter: grayscale(0%) !important;
								}
						`;
					})
					.join("")}
			`}</style>
				<div
					className="w-full h-[var(--media-sentiment-chart-height)] bg-grayUltraLight"
					ref={parentRef}
				>
					<BarChart
						width={size.width}
						height={size.height}
						data={filteredData}
						className="bg-pattern-soft"
						margin={{
							top: 0,
							right: 30,
							left: 0,
							bottom: 24,
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
							interval="equidistantPreserveStart"
							tickMargin={12}
							tickSize={8}
							tickLine={{
								strokeOpacity: 1,
								stroke: "var(--grayDark)",
							}}
						/>
						<YAxis
							stroke="var(--grayDark)"
							strokeWidth={0.25}
							fontSize="0.875rem"
						/>
						<Tooltip
							formatter={(value) => `${value} articles`}
							cursor={{ fill: "var(--bgOverlay)", fillOpacity: 0.5 }}
							content={({ payload, active }) => {
								const item = payload?.at(0)?.payload;
								if (!active || !payload || !item) return null;
								return (
									<TopicChartTooltip
										topics={topics}
										aggregationUnit={aggregationUnit}
										item={item}
									/>
								);
							}}
						/>
						{topics.map(({ topic, color }, idx) => (
							<Bar
								key={topic}
								type="monotone"
								stackId="1"
								dataKey={topic}
								stroke={color}
								fill={color}
								className={`media-sentiment-item media-sentiment-item-topic-${slugifyCssClass(
									topic,
								)} transition-all`}
							/>
						))}
					</BarChart>
				</div>
				<MediaSentimentChartLegend topics={topics} />
			</div>
		);
	},
);

export default function MediaSentimentChartWithData() {
	const { data, isPending, error, isError, isSuccess } =
		useMediaSentimentData();
	if (isPending) return <MediaSentimentChartLoading />;
	if (isError) {
		return (
			<MediaSentimentChartError
				{...parseErrorMessage(error, "media sentiment data")}
			/>
		);
	}
	if (isSuccess && data) return <MediaSentimentChart data={data} />;
	return <EmptyEventsTimeline />;
}
