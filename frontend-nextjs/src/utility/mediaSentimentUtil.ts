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

export const mediaSentimentZodSchema = z.object({
	date: z.string(),
	topic: z.string(),
	n_articles: z.number().nullable(),
});
export type MediaSentimentType = z.infer<typeof mediaSentimentZodSchema>;

const parsedMediaSentimentZodSchema = mediaSentimentZodSchema
	.omit({ date: true })
	.merge(comparableDateItemSchema);
export type ParsedMediaSentimentType = z.infer<
	typeof parsedMediaSentimentZodSchema
>;

const mediaDataTypeZodSchema = z.array(parsedMediaSentimentZodSchema);
export type MediaDataType = z.infer<typeof mediaDataTypeZodSchema>;

const mediaSentimentDataResponseTypeZodSchema = z.object({
	data: mediaSentimentZodSchema.array(),
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
});

export function getMediaSentimentQuery(
	params: {
		from?: Date;
		to?: Date;
		organizers: EventOrganizerSlugType[];
		mediaSource: MediaSourceType;
	},
	allOrganisations: OrganisationType[],
) {
	return {
		trend_type: "sentiment",
		...formatInput(params, allOrganisations),
	};
}

export async function getMediaSentimentData(
	params: {
		from?: Date;
		to?: Date;
		organizers: EventOrganizerSlugType[];
		mediaSource: MediaSourceType;
	},
	allOrganisations: OrganisationType[],
): Promise<MediaDataType> {
	const json = await fetchApiData({
		endpoint: "trend",
		body: getMediaSentimentQuery(params, allOrganisations),
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(
	response: unknown,
): ParsedMediaSentimentType[] {
	try {
		const parsedResponse =
			mediaSentimentDataResponseTypeZodSchema.parse(response);
		const sortedMedia = parsedResponse.data
			.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				...dateToComparableDateItem(x.date),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return parsedMediaSentimentZodSchema.array().parse(sortedMedia);
	} catch (error) {
		throw formatZodError(error);
	}
}
