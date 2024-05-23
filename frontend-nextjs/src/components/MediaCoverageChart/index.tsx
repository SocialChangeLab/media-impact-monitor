"use client";
import type { MediaCoverageType } from "@/utility/mediaCoverageUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useElementSize from "@custom-react-hooks/use-element-size";
import { memo, useCallback, useMemo } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import useAggregationUnit, {
	formatDateByAggregationUnit,
} from "@/components/EventsTimeline/useAggregationUnit";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import useMediaCoverageData from "@/utility/useKeywords";
import MediaCoverageChartEmpty from "./MediaCoverageChartEmpty";
import MediaCoverageChartError from "./MediaCoverageChartError";
import MediaCoverageChartLegend from "./MediaCoverageChartLegend";
import MediaCoverageChartLoading from "./MediaCoverageChartLoading";
import MediaCoverageChartTooltip from "./MediaCoverageChartTooltip";

const MediaCoverageChart = memo(
	({
		data,
	}: {
		data: MediaCoverageType[];
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
				topics: allTopics.sort().map((topic, idx) => ({
					topic,
					color: `var(--categorical-color-${idx + 1})`,
					sum: filteredData.reduce((acc, day) => acc + day[topic], 0),
				})),
				filteredData,
			};
		}, [data, intervals, isInSameUnit, aggregationUnit]);

		const reversedTopics = useMemo(() => [...topics].reverse(), [topics]);

		return (
			<div className="media-coverage-chart">
				<style jsx global>{`
				.media-coverage-chart .recharts-cartesian-grid-vertical {
					transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
				}
				.media-coverage-chart:has(.legend-topic:hover) .recharts-cartesian-grid-vertical {
					opacity: 0 !important;
				}
				.media-coverage-chart:has(.legend-topic:hover) .media-coverage-item {
					opacity: 0.2 !important;
					filter: grayscale(100%) !important;
				}
				${topics
					.map(({ topic }) => {
						const slug = slugifyCssClass(topic);
						return `
							.media-coverage-chart:has(.legend-topic-${slug}:hover)
								.media-coverage-item-topic-${slug} {
									opacity: 1 !important;
									filter: grayscale(0%) !important;
								}
						`;
					})
					.join("")}
			`}</style>
				<div
					className="w-full h-[var(--media-coverage-chart-height)] bg-grayUltraLight"
					ref={parentRef}
				>
					<LineChart
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
						/>
						<YAxis
							stroke="var(--grayDark)"
							strokeWidth={0.25}
							fontSize="0.875rem"
						/>
						<Tooltip
							formatter={(value) => `${value} articles`}
							cursor={{ stroke: "var(--grayMed)" }}
							content={({ payload, active }) => {
								const item = payload?.at(0)?.payload;
								if (!active || !payload || !item) return null;
								return (
									<MediaCoverageChartTooltip
										topics={reversedTopics}
										aggregationUnit={aggregationUnit}
										item={item}
									/>
								);
							}}
						/>
						{topics.map(({ topic }, idx) => (
							<Line
								key={topic}
								type="monotone"
								dataKey={topic}
								stroke={`var(--categorical-color-${idx + 1})`}
								fill={`var(--categorical-color-${idx + 1})`}
								className={`media-coverage-item media-coverage-item-topic-${slugifyCssClass(
									topic,
								)} transition-all`}
								activeDot={{ r: 6, stroke: "var(--grayUltraLight)" }}
							/>
						))}
					</LineChart>
				</div>
				<MediaCoverageChartLegend topics={reversedTopics} />
			</div>
		);
	},
);

export default function MediaCoverageChartWithData({
	data: initialData,
}: {
	data: MediaCoverageType[];
}) {
	const { data, isPending, error } = useMediaCoverageData(initialData);
	if (error)
		return (
			<MediaCoverageChartError
				{...parseErrorMessage(error, "media sentiment data")}
			/>
		);
	if (isPending) return <MediaCoverageChartLoading />;
	if (!data) return <MediaCoverageChartEmpty />;
	return <MediaCoverageChart data={data} />;
}
