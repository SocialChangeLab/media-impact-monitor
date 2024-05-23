"use client";
import type { MediaCoverageType } from "@/utility/mediaCoverageUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useElementSize from "@custom-react-hooks/use-element-size";
import { useCallback, useMemo } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import CollapsableSection from "./CollapsableSection";
import DataCreditLegend from "./DataCreditLegend";
import useAggregationUnit, {
	formatDateByAggregationUnit,
} from "./EventsTimeline/useAggregationUnit";

function MediaCoverageChart({
	data,
}: {
	data: MediaCoverageType[];
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
							if (!active || !payload) return null;
							const item = payload[0]?.payload;
							if (!item) return null;
							const { date } = item;
							return (
								<div className="bg-bg border border-grayMed p-4 flex flex-col gap-1">
									<strong className="font-bold font-headlines text-lg leading-tight pb-2">
										{formatDateByAggregationUnit(date, aggregationUnit)}
									</strong>
									{[...topics]
										.reverse()
										.map(({ topic }) => ({ topic, value: item[topic] }))
										.map(({ topic, value }, idx) => (
											<div
												key={topic}
												className="flex gap-2 items-center text-sm"
											>
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
			<div className="pt-6 flex gap-[max(2rem,4vmax)] sm:grid sm:grid-cols-[1fr_auto]">
				<CollapsableSection
					title="Legend"
					storageKey="media-coverage-legend-expanded"
				>
					<div className="flex flex-col gap-2">
						<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr));] gap-x-8 relative z-20">
							{[...topics].reverse().map(({ topic, color, sum }) => (
								<li
									key={topic}
									className={cn(
										"grid grid-cols-[auto_1fr_auto] gap-x-3 py-2",
										"items-center",
										`legend-topic legend-topic-${slugifyCssClass(topic)}`,
										`cursor-pointer`,
									)}
								>
									<span
										className={cn(
											"size-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
										)}
										style={{ backgroundColor: color }}
										aria-hidden="true"
									/>
									<span className="truncate flex gap-4 items-baseline">
										{`${topic.charAt(0).toUpperCase()}${topic.slice(1)}`}
										<span className="font-mono text-xs text-grayDark">
											({sum.toLocaleString("en-GB")})
										</span>
									</span>
								</li>
							))}
						</ul>
					</div>
				</CollapsableSection>
				<DataCreditLegend
					storageKey="media-coverage-data-credits-expanded"
					sources={[
						{
							label: "Media data",
							links: [
								{
									text: "MediaCloud",
									url: "https://mediacloud.org/",
								},
							],
						},
					]}
				/>
			</div>
		</div>
	);
}

export default MediaCoverageChart;
