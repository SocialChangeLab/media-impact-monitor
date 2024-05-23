import { format, parse, startOfDay } from "date-fns";
import { ZodError, z } from "zod";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import { fetchApiData } from "./fetchUtil";

const mediaCoverageZodSchema = z.object({
	date: z.string(),
	topic: z.string(),
	n_articles: z.number().nullable(),
});
export type MediaCoverageType = z.infer<typeof mediaCoverageZodSchema>;

const mediaDataTypeZodSchema = z.array(mediaCoverageZodSchema);
export type MediaDataType = z.infer<typeof mediaDataTypeZodSchema>;

const mediaCoverageDataResponseTypeZodSchema = z.object({
	data: mediaDataTypeZodSchema,
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
});

export async function getMediaCoverageData(params?: {
	from?: Date;
	to?: Date;
}): Promise<MediaDataType> {
	const json = await fetchApiData({
		endpoint: "events",
		body: {
			media_source: "news_online",
			topic: "climate_change",
			trend_type: "sentiment",
			...(params?.from && params?.to
				? {
						start_date: format(params?.from, "yyyy-MM-dd"),
						end_date: format(params?.to, "yyyy-MM-dd"),
					}
				: {}),
		},
		fallbackFilePathContent: (
			await import("../data/fallbackMediaCoverage.json")
		).default,
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(response: unknown): MediaCoverageType[] {
	try {
		const parsedResponse =
			mediaCoverageDataResponseTypeZodSchema.parse(response);
		const sortedMedia = parsedResponse.data
			.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				date: parse(x.date, "yyyy-MM-dd", startOfDay(new Date())).toISOString(),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return sortedMedia;
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
