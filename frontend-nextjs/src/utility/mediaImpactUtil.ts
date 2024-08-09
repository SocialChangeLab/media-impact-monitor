import { z } from "zod";
import { slugifyCssClass } from "./cssSlugify";
import {
	type EventOrganizerSlugType,
	eventOrganizerSlugZodSchema,
} from "./eventsUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { type TrendQueryProps, getMediaTrendQuery } from "./mediaTrendUtil";
import { getTopicColor } from "./topicsUtil";
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

const parsedMediaImpactItemZodSchema = z.object({
	impact: z.object({
		lower: z.number(),
		upper: z.number(),
		mean: z.number(),
		range: z.number(),
	}),
	label: z.string(),
	color: z.string(),
	topicSlug: z.string(),
	uniqueId: z.string(),
});
export type ParsedMediaImpactItemType = z.infer<
	typeof parsedMediaImpactItemZodSchema
>;

const parsedMediaImpactZodSchema = z.object({
	id: z.string(),
	data: z.union([z.null(), z.array(parsedMediaImpactItemZodSchema)]),
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

type SingleOrgTrendQueryType = Omit<TrendQueryProps, "params"> & {
	params: Omit<TrendQueryProps["params"], "organizers"> & {
		organizer: EventOrganizerSlugType;
	};
};
function getMediaImpactQuery(props: SingleOrgTrendQueryType) {
	const formattedInput = formatInput(props.params, props.allOrganisations);
	return {
		method: "time_series_regression",
		impacted_trend: getMediaTrendQuery({
			...props,
			params: {
				...props.params,
				organizers: [props.params.organizer],
			},
		}),
		...formattedInput,
		organizer:
			props.allOrganisations.find(({ slug }) => slug === props.params.organizer)
				?.name || "",
	};
}

export async function getMediaImpactData(
	props: SingleOrgTrendQueryType,
): Promise<ParsedMediaImpactType> {
	const { params, allOrganisations, trend_type } = props;
	const json = await fetchApiData({
		endpoint: "impact",
		body: getMediaImpactQuery(props),
	});
	const org = allOrganisations.find(({ slug }) => slug === params.organizer);
	return validateGetDataResponse(json);
}

function validateGetDataResponse(response: unknown): ParsedMediaImpactType {
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
					impact: {
						lower: a.ci_lower,
						upper: a.ci_upper,
						mean: a.mean,
						range: Math.abs(a.ci_lower - a.ci_upper),
					},
					label: key,
					color: getTopicColor(key),
					topicSlug: slugifyCssClass(key),
					uniqueId: slugifyCssClass(`${key}-${parsedResponse.query.organizer}`),
				}),
			),
		});
	} catch (error) {
		throw formatZodError(error);
	}
}
