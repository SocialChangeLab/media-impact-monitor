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

const mediaDataTypeZodSchema = z.union([
	z.object({
		applicability: z.literal(true),
		limitations: z.array(z.string()),
		trends: z.array(mediaCoverageZodSchema),
	}),
	z.object({
		applicability: z.literal(false),
		limitations: z.array(z.string()),
		trends: z.null(),
	}),
]);

const parsedMediaCoverageResponseTypeZodSchema = z.union([
	z.object({
		applicability: z.literal(true),
		limitations: z.array(z.string()),
		trends: z.array(parsedMediaCoverageZodSchema),
	}),
	z.object({
		applicability: z.literal(false),
		limitations: z.array(z.string()),
		trends: z.null(),
	}),
]);
export type ParsedMediaCoverageResponseType = z.infer<
	typeof parsedMediaCoverageResponseTypeZodSchema
>;

const mediaCoverageDataResponseTypeZodSchema = z.object({
	data: mediaDataTypeZodSchema,
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
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
		const parsedResponse =
			mediaCoverageDataResponseTypeZodSchema.parse(response);
		const sortedMedia = parsedResponse.data.trends
			?.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				...dateToComparableDateItem(x.date),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return parsedMediaCoverageResponseTypeZodSchema.parse({
			applicability: parsedResponse.data.applicability,
			limitations: parsedResponse.data.limitations,
			data: sortedMedia,
		});
	} catch (error) {
		throw formatZodError(error);
	}
}
