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

const mediaCoverageZodSchema = z.object({
	date: z.string(),
	topic: z.string(),
	n_articles: z.number().nullable(),
});
export type MediaCoverageType = z.infer<typeof mediaCoverageZodSchema>;

const parsedMediaCoverageZodSchema = mediaCoverageZodSchema
	.omit({ date: true })
	.merge(comparableDateItemSchema);
export type ParsedMediaCoverageType = z.infer<
	typeof parsedMediaCoverageZodSchema
>;

const rawResponseDataZodSchema = z.object({
	applicability: z.boolean(),
	limitations: z.array(z.string()),
	trends: z.array(mediaCoverageZodSchema).default([]),
});

const parsedResponseDataZodSchema = z.object({
	applicability: z.boolean(),
	limitations: z.array(z.string()),
	trends: z.array(parsedMediaCoverageZodSchema).default([]),
});

export type ParsedMediaCoverageResponseType = z.infer<
	typeof parsedResponseDataZodSchema
>;

const rawResponseZodSchema = z.object({
	data: rawResponseDataZodSchema,
});

export async function getMediaCoverageData(
	allOrganisations: OrganisationType[],
	params?: {
		from?: Date;
		to?: Date;
		organizers: EventOrganizerSlugType[];
		mediaSource: MediaSourceType;
	},
): Promise<ParsedMediaCoverageResponseType> {
	// return {
	// 	applicability: false,
	// 	limitations: [
	// 		"This time range is not supported when using online media sources.",
	// 		"Fridays for Futures is the only supported organisation.",
	// 	],
	// 	trends: null,
	// };
	const json = await fetchApiData({
		endpoint: "trend",
		body: {
			trend_type: "keywords",
			...formatInput(params || {}, allOrganisations),
		},
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(
	response: unknown,
): ParsedMediaCoverageResponseType {
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
