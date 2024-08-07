import type { MediaSourceType } from "@/stores/filtersStore";
import { z } from "zod";
import {
	comparableDateItemSchema,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import type { EventOrganizerSlugType, OrganisationType } from "./eventsUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { formatZodError } from "./zodUtil";

export const mediaTrendZodSchema = z.object({
	date: z.string(),
	topic: z.string(),
	n_articles: z.number().nullable(),
});
export type MediaTrendType = z.infer<typeof mediaTrendZodSchema>;

const parsedMediaTrendZodSchema = mediaTrendZodSchema
	.omit({ date: true })
	.merge(comparableDateItemSchema);
export type ParsedMediaTrendType = z.infer<typeof parsedMediaTrendZodSchema>;

const rawResponseDataZodSchema = z.object({
	applicability: z.boolean(),
	limitations: z.array(z.string()),
	trends: z.array(mediaTrendZodSchema).default([]),
});

const parsedResponseDataZodSchema = z.object({
	applicability: z.boolean(),
	limitations: z.array(z.string()),
	trends: z.array(parsedMediaTrendZodSchema).default([]),
});

export type ParsedMediaTrendResponseType = z.infer<
	typeof parsedResponseDataZodSchema
>;

const rawResponseZodSchema = z.object({
	data: rawResponseDataZodSchema,
});

export type TrendQueryProps = {
	trend_type: "keywords" | "sentiment";
	sentiment_target?: "activism" | "policy" | null;
	params: {
		from?: Date;
		to?: Date;
		organizers: EventOrganizerSlugType[];
		mediaSource: MediaSourceType;
	};
	allOrganisations: OrganisationType[];
};
export function getMediaTrendQuery({
	trend_type,
	sentiment_target = null,
	params,
	allOrganisations,
}: TrendQueryProps) {
	return {
		trend_type: trend_type,
		sentiment_target: sentiment_target,
		...formatInput(params, allOrganisations),
	};
}

export async function getMediaTrendData(
	props: TrendQueryProps,
): Promise<ParsedMediaTrendResponseType> {
	const json = await fetchApiData({
		endpoint: "trend",
		body: getMediaTrendQuery(props),
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(
	response: unknown,
): ParsedMediaTrendResponseType {
	try {
		const parsedResponse = rawResponseZodSchema.parse(response);
		const sortedMedia = parsedResponse.data.trends
			?.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				...dateToComparableDateItem(x.date),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return parsedResponseDataZodSchema.parse({
			applicability: parsedResponse.data.applicability,
			limitations: parsedResponse.data.limitations,
			trends: sortedMedia,
		});
	} catch (error) {
		throw formatZodError(error);
	}
}
