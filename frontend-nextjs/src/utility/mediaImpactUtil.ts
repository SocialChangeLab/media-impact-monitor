import type { MediaSourceType } from "@/stores/filtersStore";
import { z } from "zod";
import { slugifyCssClass } from "./cssSlugify";
import {
	type EventOrganizerSlugType,
	type OrganisationType,
	eventOrganizerSlugZodSchema,
} from "./eventsUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { getMediaTrendQuery } from "./mediaTrendUtil";
import { formatZodError } from "./zodUtil";

const mediaImpactZodSchema = z.object({
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
export type MediaImpactType = z.infer<typeof mediaImpactZodSchema>;

const parsedMediaImpactZodSchema = z.object({
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
type ParsedMediaImpactType = z.infer<typeof parsedMediaImpactZodSchema>;

const mediaSentimentQueryZodSchema = z.object({
	organizer: eventOrganizerSlugZodSchema,
});

const mediaImpactDataTypeZodSchema = z.object({
	query: mediaSentimentQueryZodSchema,
	data: mediaImpactZodSchema,
});
export type MediaImpactDataType = z.infer<typeof mediaImpactDataTypeZodSchema>;

function getMediaImpactQuery(
	type: "keywords" | "sentiment",
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
		impacted_trend: getMediaTrendQuery(
			type,
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

export async function getMediaImpactData(
	type: "keywords" | "sentiment",
	params: {
		organizer: EventOrganizerSlugType;
		mediaSource: MediaSourceType;
		from?: Date;
		to?: Date;
	},
	allOrganisations: OrganisationType[],
): Promise<ParsedMediaImpactType> {
	const json = await fetchApiData({
		endpoint: "impact",
		body: getMediaImpactQuery(type, params || {}, allOrganisations),
	});
	return validateGetDataResponse(type, json);
}

function validateGetDataResponse(
	type: "keywords" | "sentiment",
	response: unknown,
): ParsedMediaImpactType {
	try {
		const parsedResponse = mediaImpactDataTypeZodSchema.parse(response);
		if (parsedResponse.data.impact_estimates === null) {
			return {
				id: parsedResponse.query.organizer,
				data: null,
				limitations: parsedResponse.data.method_limitations,
			};
		}
		return parsedMediaImpactZodSchema.parse({
			id: parsedResponse.query.organizer,
			data: Object.entries(parsedResponse.data.impact_estimates).map(
				([key, { absolute_impact: a }]) => ({
					impact: a.mean,
					uncertainty: Math.abs(
						Math.max(a.ci_lower - a.mean, a.ci_upper - a.mean),
					),
					label: key,
					color: `var(--${type}-${key})`,
					uniqueId: `${key}-${slugifyCssClass(parsedResponse.query.organizer)}`,
				}),
			),
		});
	} catch (error) {
		throw formatZodError(error);
	}
}
