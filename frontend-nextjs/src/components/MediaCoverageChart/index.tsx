"use client";
import type { MediaCoverageType } from "@/utility/mediaCoverageUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useElementSize from "@custom-react-hooks/use-element-size";
import { Suspense, memo, useCallback, useMemo } from "react";
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
import TopicChartTooltip from "@/components/TopicChartTooltip";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import useMediaCoverageData from "@/utility/useKeywords";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getIdxsWithTicks } from "../EventsTimeline/EventsTimelineAxis";
import MediaCoverageChartEmpty from "./MediaCoverageChartEmpty";
import MediaCoverageChartError from "./MediaCoverageChartError";
import MediaCoverageChartLegend from "./MediaCoverageChartLegend";
import MediaCoverageChartLoading from "./MediaCoverageChartLoading";

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

		const idxsWithTicks = useMemo(
			() => getIdxsWithTicks(intervals.length, size.width),
			[intervals.length, size.width],
		);

		return (
			<div className="media-coverage-chart">
				<style jsx global>{`
				.media-coverage-chart .recharts-cartesian-grid-vertical {
					transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
					opacity: 0 !important;
				}
				.media-coverage-chart svg:hover .recharts-cartesian-grid-vertical {
					opacity: 1 !important;
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
							cursor={{ stroke: "var(--grayMed)" }}
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
							<Line
								key={topic}
								type="monotone"
								dataKey={topic}
								stroke={color}
								fill={color}
								className={`media-coverage-item media-coverage-item-topic-${slugifyCssClass(
									topic,
								)} transition-all`}
								activeDot={{ r: 6, stroke: "var(--grayUltraLight)" }}
							/>
						))}
					</LineChart>
				</div>
				<MediaCoverageChartLegend topics={topics} />
			</div>
		);
	},
);

function MediaCoverageChartWithData() {
	const { data, isFetching } = useMediaCoverageData();
	if (isFetching) return <MediaCoverageChartLoading />;
	if (data) return <MediaCoverageChart data={data} />;
	return <MediaCoverageChartEmpty />;
}
export default function MediaCoverageChartWithErrorBoundary() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => (
						<MediaCoverageChartError
							{...parseErrorMessage(error)}
							reset={reset}
						/>
					)}
				>
					<Suspense fallback={<MediaCoverageChartLoading />}>
						<MediaCoverageChartWithData />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
