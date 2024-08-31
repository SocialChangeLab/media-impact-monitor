import { formatDateByAggregationUnit } from "@/components/EventsTimeline/useAggregationUnit";
import { getSentimentLabel } from "@/components/SentimentLabel";
import { useToday } from "@/providers/TodayProvider";
import { addDays, differenceInDays, isSameDay, subDays } from "date-fns";
import { useMemo } from "react";
import slugify from "slugify";
import {
	type ComparableDateItemType,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare, format } from "./dateUtil";
import type { ParsedMediaTrendResponseType } from "./mediaTrendUtil";
import { today as defaultToday } from "./today";
import { useFullTexts } from "./useFullTexts";

type FullTextsTrendItem = {
	date: Date;
	dateFormatted: string;
	comparableDateObject: ComparableDateItemType;
	positive: number;
	neutral: number;
	negative: number;
};

export type ParsedFullTextsType = Omit<
	ReturnType<typeof useFullTexts>,
	"data"
> & {
	data:
		| null
		| (Omit<ParsedMediaTrendResponseType, "trends"> & {
				trends: FullTextsTrendItem[];
		  });
};

export function useFullTextsTrends({
	event_id,
	sentiment_target,
}: {
	event_id?: string;
	sentiment_target?: "policy" | "activism" | null;
}): ParsedFullTextsType {
	const query = useFullTexts({ event_id });
	const { today } = useToday();

	const fullTextsAsTrends = useMemo(() => {
		if (!query.data) {
			return {
				applicability: false,
				limitations: [],
				trends: [],
			};
		}
		if (!sentiment_target) {
			return {
				applicability: false,
				limitations: [
					'Invalid sentiment_target. Must be "policy" or "activism"',
				],
				trends: [],
			};
		}
		const dateToValMap = query.data
			.reduce((acc, d) => {
			const currentSentiment =
				sentiment_target === "policy"
					? d.policy_sentiment
					: d.activism_sentiment;
			const topic = slugify(getSentimentLabel(currentSentiment), {
				lower: true,
				strict: true,
			});
			console.log(currentSentiment);
			if (currentSentiment === null) return acc;
			const key = format(d.date, "yyyy-MM-dd");
			const existingVal = acc.get(key);
			const baseObj = {
				date: d.date,
				dateFormatted: formatDateByAggregationUnit(d.date, "day"),
				comparableDateObject: dateToComparableDateItem(d.date, today),
				positive: existingVal?.positive ?? 0,
				neutral: existingVal?.neutral ?? 0,
				negative: existingVal?.negative ?? 0,
			};
			acc.set(key, {
				...baseObj,
				[topic]:
					(baseObj[topic as "positive" | "neutral" | "negative"] ?? 0) + 1,
			});
			return acc;
		}, new Map<string, FullTextsTrendItem>());
		const trends = ensureSevenDays(
			Array.from(dateToValMap.values()).sort((a, b) =>
				dateSortCompare(a.date, b.date, today)),
		);
		return {
			applicability: true,
			limitations: [],
			trends,
		};
	}, [query.data, sentiment_target, today]);

	return {
		...query,
		data: fullTextsAsTrends ?? [],
	};
}

function ensureSevenDays(arr: FullTextsTrendItem[]): FullTextsTrendItem[] {
	const minDaysCount = 7;

	if (arr.length === 0) return [];
	if (arr.length >= minDaysCount) return arr;
	const earliestDataDate = arr[0].date;
	const latestDataDate = arr[arr.length - 1].date;
	const dataDaysDiff = differenceInDays(latestDataDate, earliestDataDate);

	const daysOnSide =
		dataDaysDiff >= minDaysCount
			? 1
			: Math.ceil((minDaysCount - dataDaysDiff) / 2);
	const earliestDate = subDays(earliestDataDate, daysOnSide);
	const latestDate = addDays(latestDataDate, daysOnSide);
	const daysDiff = Math.abs(differenceInDays(earliestDate, latestDate));

	const allDays = [...new Array(daysDiff + 1)].map((_, i) => {
		const date = addDays(earliestDate, i);
		const dataEntry = arr.find((d) => isSameDay(d.date, date));
		if (dataEntry) return dataEntry;
		return createPlaceholderDay(date);
	});

	return allDays;
}

function createPlaceholderDay(
	date: Date,
	today = defaultToday,
): FullTextsTrendItem {
	return {
		date,
		dateFormatted: formatDateByAggregationUnit(date, "day"),
		comparableDateObject: dateToComparableDateItem(date, today),
		positive: 0,
		neutral: 0,
		negative: 0,
	};
}
