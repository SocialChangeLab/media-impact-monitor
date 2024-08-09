"use client";
import type {
	ParsedMediaTrendType,
	TrendQueryProps,
} from "@/utility/mediaTrendUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useElementSize from "@custom-react-hooks/use-element-size";
import { Suspense, memo, useCallback, useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import useAggregationUnit, {
	formatDateByAggregationUnit,
} from "@/components/EventsTimeline/useAggregationUnit";
import type { ComparableDateItemType } from "@/utility/comparableDateItemSchema";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import useMediaTrends from "@/utility/useMediaTrends";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { BarChartIcon } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import ChartLimitations from "../ChartLimitations";
import TopicChartTooltip from "../TopicChartTooltip";
import MediaSentimentChartEmpty from "./MediaSentimentChartEmpty";
import MediaSentimentChartError from "./MediaSentimentChartError";
import MediaSentimentChartLoading from "./MediaSentimentChartLoading";

export const MediaSentimentChart = memo(
	({
		data,
	}: {
		data: ParsedMediaTrendType[];
	}) => {
		const [parentRef, size] = useElementSize();
		const aggregationUnit = useAggregationUnit(size.width);
		const intervals = useTimeIntervals({ aggregationUnit });

		const isInSameUnit = useCallback(
			(comparableDateObject: ComparableDateItemType, b: Date) =>
				isInSameAggregationUnit(aggregationUnit, comparableDateObject, b),
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
			const filteredData = intervals.map((comparableDateObject) => {
				const daysInUnit = data.filter((day) =>
					isInSameUnit(comparableDateObject, new Date(day.date)),
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
						comparableDateObject,
						dateFormatted: formatDateByAggregationUnit(
							comparableDateObject.date,
							aggregationUnit,
						),
					} as {
						comparableDateObject: ComparableDateItemType;
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
				<div
					className="w-full h-[var(--media-sentiment-chart-height)] bg-grayUltraLight"
					ref={parentRef}
				>
					<ResponsiveContainer>
						<BarChart
							data={filteredData}
							className="bg-pattern-soft"
							margin={{
								top: 0,
								right: 0,
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
							{topics.map(({ topic, color }) => (
								<Bar
									key={topic}
									type="monotone"
									stackId="1"
									dataKey={topic}
									stroke={color}
									fill={color}
									className={`topic-chart-item topic-chart-item-topic-${slugifyCssClass(
										topic,
									)} transition-all`}
								/>
							))}
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		);
	},
);

function MediaSentimentChartWithData({
	reset,
	sentiment_target,
}: {
	reset?: () => void;
	sentiment_target: TrendQueryProps["sentiment_target"];
}) {
	const { data, isError, isSuccess, isPending } = useMediaTrends({
		trend_type: "sentiment",
		sentiment_target,
	});
	if (isPending) return <MediaSentimentChartLoading />;
	if (isError)
		return (
			<MediaSentimentChartError {...parseErrorMessage(isError)} reset={reset} />
		);
	if (isSuccess && data.applicability === false && data.limitations.length > 0)
		return (
			<ChartLimitations limitations={data.limitations} Icon={BarChartIcon} />
		);
	if (isSuccess && data.applicability && data.trends.length > 0)
		return <MediaSentimentChart data={data.trends} />;
	return <MediaSentimentChartEmpty />;
}
export default function MediaCoverageChartWithErrorBoundary({
	sentiment_target,
}: {
	sentiment_target: TrendQueryProps["sentiment_target"];
}) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => (
						<MediaSentimentChartError
							{...parseErrorMessage(error)}
							reset={reset}
						/>
					)}
				>
					<Suspense fallback={<MediaSentimentChartLoading />}>
						<MediaSentimentChartWithData
							reset={reset}
							sentiment_target={sentiment_target}
						/>
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
