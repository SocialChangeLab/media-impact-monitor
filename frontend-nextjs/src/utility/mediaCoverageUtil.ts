import { format } from "date-fns";
import { ZodError, z } from "zod";
import {
	comparableDateItemSchema,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import { fetchApiData } from "./fetchUtil";

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
}): Promise<ParsedMediaCoverageType[]> {
	const json = await fetchApiData({
		endpoint: "trend",
		body: {
			media_source: "news_online",
			topic: "climate_change",
			trend_type: "keywords",
			...(params?.from && params?.to
				? {
						start_date: format(params?.from, "yyyy-MM-dd"),
						end_date: format(params?.to, "yyyy-MM-dd"),
					}
				: {}),
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
		if (error instanceof ZodError) {
			const errorMessage = (error.issues ?? [])
				.map(
					(x) =>
						`${x.message}${x.path.length > 0 ? ` at ${x.path.join(".")}` : ""}`,
				)
				.join(", ");
			throw new Error(`ZodError&&&${errorMessage}`);
		}
		if (error instanceof Error) throw error;
		throw new Error(`UnknownError&&&${error}`);
	}
}
