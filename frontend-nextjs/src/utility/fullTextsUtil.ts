import type { MediaSourceType } from "@/stores/filtersStore";
import { z } from "zod";
import type { EventOrganizerSlugType, OrganisationType } from "./eventsUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { formatZodError } from "./zodUtil";

export const rawFullTextsZodSchema = z.object({
	title: z.string(),
	date: z.coerce.date(),
	url: z.string().url(),
	text: z.string(),
	activism_sentiment: z.number().nullable(),
	policy_sentiment: z.number().nullable(),
});
export type RawFullTextType = z.infer<typeof rawFullTextsZodSchema>;

const parsedFullTextsZodSchema = rawFullTextsZodSchema;
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
	return validateFullTextsResponse(json);
}

function validateFullTextsResponse(
	response: unknown,
): ParsedFullTextsResponseType {
	try {
		const parsedResponse = rawResponseZodSchema.parse(response);
		const sortedMedia = parsedResponse.data.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);
		return parsedResponseDataZodSchema.parse(sortedMedia);
	} catch (error) {
		throw formatZodError(error);
	}
}
