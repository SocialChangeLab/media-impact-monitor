import useAggregationUnit, {
	formatDateByAggregationUnit,
} from "@/components/EventsTimeline/useAggregationUnit";
import { useCallback, useMemo } from "react";
import type { ComparableDateItemType } from "./comparableDateItemSchema";
import type { TrendQueryProps } from "./mediaTrendUtil";
import { getTopicColor } from "./topicsUtil";
import useMediaTrends from "./useMediaTrends";
import useTimeIntervals, { isInSameAggregationUnit } from "./useTimeIntervals";

function useTopics({
	containerWidth,
	trend_type,
	sentiment_target,
}: {
	containerWidth: number;
	trend_type: TrendQueryProps["trend_type"];
	sentiment_target: TrendQueryProps["sentiment_target"];
}) {
	const query = useMediaTrends({ trend_type, sentiment_target });
	const data = useMemo(() => query.data?.trends || [], [query.data?.trends]);

	const aggregationUnit = useAggregationUnit(containerWidth);
	const intervals = useTimeIntervals({ aggregationUnit });

	const isInSameUnit = useCallback(
		(comparableDateItem: ComparableDateItemType, date: ComparableDateItemType) =>
			isInSameAggregationUnit(aggregationUnit, comparableDateItem, date),
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
				isInSameUnit(comparableDateObject, day),
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
					comparableDateObject: comparableDateObject,
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
				color: getTopicColor(topic),
				sum: filteredData.reduce((acc, day) => acc + day[topic], 0),
			})),
			filteredData,
		};
	}, [data, intervals, isInSameUnit, aggregationUnit]);

	return {
		applicability: query.data?.applicability ?? true,
		limitations: query.data?.limitations ?? [],
		topics,
		filteredData,
		aggregationUnit,
	};
}

export default useTopics;
