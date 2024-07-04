import type { MediaSourceType } from "@/stores/filtersStore";
import { ZodError, z } from "zod";
import { fetchApiData, formatInput } from "./fetchUtil";
import { getMediaSentimentQuery } from "./mediaSentimentUtil";

const mediaSentimentImpactZodSchema = z.object({
	method_applicability: z.boolean(),
	method_limitations: z.array(z.string()),
	impact_estimates: z.record(
		z.string(),
		z.object({
			absolute_impact: z.object({
				mean: z.number(),
				ci_upper: z.number(),
				ci_lower: z.number(),
			}),
			absolute_impact_time_series: z.array(
				z.object({
					date: z.number(),
					mean: z.number(),
					ci_upper: z.number(),
					ci_lower: z.number(),
				}),
			),
		}),
	),
});
export type MediaSentimentImpactType = z.infer<
	typeof mediaSentimentImpactZodSchema
>;

const parsedMediaSentimentImpactZodSchema = z.object({
	id: z.string(),
	data: z.array(
		z.object({
			impact: z.number(),
			uncertainty: z.number().nullable(),
			label: z.string(),
			color: z.string(),
			uniqueId: z.string(),
		}),
	),
});
type ParsedMediaSentimentImpactType = z.infer<
	typeof parsedMediaSentimentImpactZodSchema
>;

const mediaSentimentQueryZodSchema = z.object({
	organizer: z.string(),
});

const mediaImpactDataTypeZodSchema = z.object({
	query: mediaSentimentQueryZodSchema,
	data: mediaSentimentImpactZodSchema,
});
export type MediaSentimentImpactDataType = z.infer<
	typeof mediaImpactDataTypeZodSchema
>;

function getMediaSentimentImpactQuery(params: {
	organizer: string;
	mediaSource: MediaSourceType;
	from?: Date;
	to?: Date;
}) {
	return {
		method: "time_series_regression",
		impacted_trend: getMediaSentimentQuery({
			...params,
			organizers: [params.organizer],
		}),
		...formatInput(params),
	};
}

export async function getMediaSentimentImpactData(params: {
	organizer: string;
	mediaSource: MediaSourceType;
	from?: Date;
	to?: Date;
}): Promise<ParsedMediaSentimentImpactType> {
	const json = await fetchApiData({
		endpoint: "impact",
		body: getMediaSentimentImpactQuery(params),
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(
	response: unknown,
): ParsedMediaSentimentImpactType {
	try {
		const parsedResponse = mediaImpactDataTypeZodSchema.parse(response);
		return parsedMediaSentimentImpactZodSchema.parse({
			id: parsedResponse.query.organizer,
			data: Object.entries(parsedResponse.data.impact_estimates).map(
				([key, { absolute_impact }]) => ({
					impact: absolute_impact.mean,
					uncertainty: absolute_impact.ci_upper - absolute_impact.mean,
					label: key,
					color: `var(--sentiment-${key})`,
					uniqueId: `${key}-${absolute_impact.mean}`,
				}),
			),
		});
	} catch (error) {
		if (error instanceof ZodError) {
			const errorMessage = (error.issues ?? [])
				.map(
					(x) =>
						`  - ${x.path.length > 0 ? `${x.path.join(".")}` : ""}: ${
							x.message
						}`,
				)
				.join("\n");
			throw new Error(`ZodError&&&${errorMessage}`);
		}
		if (error instanceof Error) throw error;
		throw new Error(`UnknownError&&&${error}`);
	}
}
