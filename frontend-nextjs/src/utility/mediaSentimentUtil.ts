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

const mediaDataTypeZodSchema = z.union([
	z.object({
		applicability: z.literal(true),
		limitations: z.array(z.string()),
		trends: z.array(mediaSentimentZodSchema),
	}),
	z.object({
		applicability: z.literal(false),
		limitations: z.array(z.string()),
		trends: z.null(),
	}),
]);

const parsedMediaSentimentResponseTypeZodSchema = z.union([
	z.object({
		applicability: z.literal(true),
		limitations: z.array(z.string()),
		trends: z.array(parsedMediaSentimentZodSchema),
	}),
	z.object({
		applicability: z.literal(false),
		limitations: z.array(z.string()),
		trends: z.null(),
	}),
]);
export type ParsedMediaSentimentResponseType = z.infer<
	typeof parsedMediaSentimentResponseTypeZodSchema
>;

const mediaSentimentDataResponseTypeZodSchema = z.object({
	data: mediaDataTypeZodSchema,
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
): Promise<ParsedMediaSentimentResponseType> {
	const json = await fetchApiData({
		endpoint: "trend",
		body: getMediaSentimentQuery(params, allOrganisations),
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(
	response: unknown,
): ParsedMediaSentimentResponseType {
	try {
		const parsedResponse =
			mediaSentimentDataResponseTypeZodSchema.parse(response);
		const sortedMedia = parsedResponse.data.trends
			?.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				...dateToComparableDateItem(x.date),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return parsedMediaSentimentResponseTypeZodSchema.parse({
			applicability: parsedResponse.data.applicability,
			limitations: parsedResponse.data.limitations,
			data: sortedMedia,
		});
	} catch (error) {
		throw formatZodError(error);
	}
}
