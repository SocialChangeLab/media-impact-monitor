import { formatDateByAggregationUnit } from "@/components/EventsTimeline/useAggregationUnit";
import { getSentimentLabel } from "@/components/SentimentLabel";
import { format } from "date-fns";
import { useMemo } from "react";
import slugify from "slugify";
import {
	type ComparableDateItemType,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare } from "./dateUtil";
import type { ParsedMediaTrendResponseType } from "./mediaTrendUtil";
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
		const dateToValMap = query.data.reduce((acc, d) => {
			const currentSentiment =
				sentiment_target === "policy"
					? d.policy_sentiment
					: d.activism_sentiment;
			const topic = slugify(getSentimentLabel(currentSentiment), {
				lower: true,
				strict: true,
			});
			if (currentSentiment === null) return acc;
			const key = format(d.date, "yyyy-MM-dd");
			const existingVal = acc.get(key);
			const baseObj = {
				date: d.date,
				dateFormatted: formatDateByAggregationUnit(d.date, "day"),
				comparableDateObject: dateToComparableDateItem(d.date),
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
		const trends = Array.from(dateToValMap.values()).sort(dateSortCompare);
		return {
			applicability: true,
			limitations: [],
			trends,
		};
	}, [query.data, sentiment_target]);

	return {
		...query,
		data: fullTextsAsTrends ?? [],
	};
}
