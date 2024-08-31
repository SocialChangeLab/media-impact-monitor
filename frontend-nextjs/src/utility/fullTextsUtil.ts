import type { MediaSourceType } from "@/stores/filtersStore";
import { compareAsc, parse } from "date-fns";
import { z } from "zod";
import type { EventOrganizerSlugType, OrganisationType } from "./eventsUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { formatZodError } from "./zodUtil";

export const rawFullTextsZodSchema = z.object({
	title: z.string(),
	date: z.string(),
	url: z.string().url(),
	text: z.string(),
	activism_sentiment: z.number().nullable(),
	policy_sentiment: z.number().nullable(),
});
export type RawFullTextType = z.infer<typeof rawFullTextsZodSchema>;

const parsedFullTextsZodSchema = rawFullTextsZodSchema
	.omit({ date: true })
	.extend({
		date: z.date(),
	});
export type ParsedFullTextType = z.infer<typeof parsedFullTextsZodSchema>;

const rawResponseDataZodSchema = z.array(rawFullTextsZodSchema).default([]);

const parsedResponseDataZodSchema = z
	.array(parsedFullTextsZodSchema)
	.default([]);

export type ParsedFullTextsResponseType = z.infer<
	typeof parsedResponseDataZodSchema
>;

const rawResponseZodSchema = z.object({
	data: rawResponseDataZodSchema,
});

export type FullTextsQueryProps = {
	event_id: string;
	mediaSource?: MediaSourceType;
	organizers: EventOrganizerSlugType[];
	allOrganisations: OrganisationType[];
	today: Date;
};

function getFullTextsQuery({
	event_id,
	organizers,
	allOrganisations,
}: FullTextsQueryProps) {
	return {
		event_id,
		...formatInput(
			{ mediaSource: "news_online", organizers },
			allOrganisations,
		),
	};
}

export async function getFullTextsData(props: FullTextsQueryProps) {
	const json = await fetchApiData({
		endpoint: "fulltexts",
		body: getFullTextsQuery(props),
	});
	return validateFullTextsResponse(json, props.today);
}

function validateFullTextsResponse(
	response: unknown,
	today: Date,
): ParsedFullTextsResponseType {
	try {
		const parsedResponse = rawResponseZodSchema
			.transform((val) =>
				val.data.map((d) => ({
					...d,
					date: parse(d.date, "yyyy-MM-dd", today),
				})),
			)
			.parse(response);
		const sortedMedia = parsedResponse.sort(
			(a, b) => compareAsc(a.date, b.date),
		);
		return parsedResponseDataZodSchema.parse(sortedMedia);
	} catch (error) {
		throw formatZodError(error);
	}
}
