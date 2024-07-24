import type { MediaSourceType } from "@/stores/filtersStore";
import { z } from "zod";
import {
	type EventOrganizerSlugType,
	type OrganisationType,
	eventOrganizerSlugZodSchema,
} from "./eventsUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { getMediaSentimentQuery } from "./mediaSentimentUtil";
import { formatZodError } from "./zodUtil";

const mediaSentimentImpactZodSchema = z.object({
	method_applicability: z.boolean(),
	method_limitations: z.array(z.string()),
	impact_estimates: z.union([
		z.null(),
		z.record(
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
	]),
});
export type MediaSentimentImpactType = z.infer<
	typeof mediaSentimentImpactZodSchema
>;

const parsedMediaSentimentImpactZodSchema = z.object({
	id: z.string(),
	data: z.union([
		z.null(),
		z.array(
			z.object({
				impact: z.number(),
				uncertainty: z.number().nullable(),
				label: z.string(),
				color: z.string(),
				uniqueId: z.string(),
			}),
		),
	]),
	limitations: z.array(z.string()).optional().default([]),
});
type ParsedMediaSentimentImpactType = z.infer<
	typeof parsedMediaSentimentImpactZodSchema
>;

const mediaSentimentQueryZodSchema = z.object({
	organizer: eventOrganizerSlugZodSchema,
});

const mediaImpactDataTypeZodSchema = z.object({
	query: mediaSentimentQueryZodSchema,
	data: mediaSentimentImpactZodSchema,
});
export type MediaSentimentImpactDataType = z.infer<
	typeof mediaImpactDataTypeZodSchema
>;

function getMediaSentimentImpactQuery(
	params: {
		organizer: EventOrganizerSlugType;
		mediaSource: MediaSourceType;
		from?: Date;
		to?: Date;
	},
	allOrganisations: OrganisationType[],
) {
	const formattedInput = formatInput(params, allOrganisations);
	return {
		method: "time_series_regression",
		impacted_trend: getMediaSentimentQuery(
			{
				...params,
				organizers: [params.organizer],
			},
			allOrganisations,
		),
		...formattedInput,
		organizer:
			allOrganisations.find(({ slug }) => slug === params.organizer)?.name ||
			"",
	};
}

export async function getMediaSentimentImpactData(
	params: {
		organizer: EventOrganizerSlugType;
		mediaSource: MediaSourceType;
		from?: Date;
		to?: Date;
	},
	allOrganisations: OrganisationType[],
): Promise<ParsedMediaSentimentImpactType> {
	const json = await fetchApiData({
		endpoint: "impact",
		body: getMediaSentimentImpactQuery(params || {}, allOrganisations),
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(
	response: unknown,
): ParsedMediaSentimentImpactType {
	try {
		const parsedResponse = mediaImpactDataTypeZodSchema.parse(response);
		if (parsedResponse.data.impact_estimates === null) {
			return {
				id: parsedResponse.query.organizer,
				data: null,
				limitations: parsedResponse.data.method_limitations,
			};
		}
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
		throw formatZodError(error);
	}
}
