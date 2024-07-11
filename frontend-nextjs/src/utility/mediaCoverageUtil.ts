import type { MediaSourceType } from "@/stores/filtersStore";
import { z } from "zod";
import {
	comparableDateItemSchema,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import type { OrganisationType } from "./eventsUtil";
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

const mediaDataTypeZodSchema = z.array(parsedMediaCoverageZodSchema);

const mediaCoverageDataResponseTypeZodSchema = z.object({
	data: mediaCoverageZodSchema.array(),
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
});

export async function getMediaCoverageData(params?: {
	from?: Date;
	to?: Date;
	organizers: OrganisationType["name"][];
	mediaSource: MediaSourceType;
}): Promise<ParsedMediaCoverageType[]> {
	const json = await fetchApiData({
		endpoint: "trend",
		body: {
			trend_type: "keywords",
			...formatInput(params),
		},
		// fallbackFilePathContent: (
		// 	await import("../data/fallbackMediaCoverage.json")
		// ).default,
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(response: unknown): ParsedMediaCoverageType[] {
	try {
		const parsedResponse =
			mediaCoverageDataResponseTypeZodSchema.parse(response);
		const sortedMedia = parsedResponse.data
			.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				...dateToComparableDateItem(x.date),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return mediaDataTypeZodSchema.parse(sortedMedia);
	} catch (error) {
		throw formatZodError(error);
	}
}
