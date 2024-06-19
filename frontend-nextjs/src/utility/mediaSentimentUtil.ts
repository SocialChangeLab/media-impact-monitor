import { format } from "date-fns";
import { ZodError, z } from "zod";
import {
	comparableDateItemSchema,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import { fetchApiData } from "./fetchUtil";

const mediaSentimentZodSchema = z.object({
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

export async function getMediaSentimentData(params?: {
	from?: Date;
	to?: Date;
}): Promise<MediaDataType> {
	const json = await fetchApiData({
		endpoint: "trend",
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
		// fallbackFilePathContent: (
		// 	await import("../data/fallbackMediaSentiment.json")
		// ).default,
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
