import { parse } from "date-fns";
import { z } from "zod";
import { fetchApiData, formatInput } from "./fetchUtil";
import { formatZodError } from "./zodUtil";

export const eventMediaInputQueryZodSchema = z.object({
	mediaSource: z.enum(["news_online", "news_print", "web_google"]),
	from: z.coerce.date().optional(),
	to: z.coerce.date().optional(),
	eventId: z.string(),
	topic: z.string().optional().default("climate_change"),
	organizers: z.array(z.string()).optional(),
	query: z.string().optional(),
});
export type EventMediaInputQueryType = z.infer<
	typeof eventMediaInputQueryZodSchema
>;

const eventMediaOutputQueryZodSchema = z.object({
	media_source: z.enum(["news_online", "news_print", "web_google"]),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	event_id: z.string(),
	topic: z.string(),
	organizers: z.array(z.string()).optional(),
});

const eventMediaZodSchema = z.object({
	title: z.string(),
	date: z.string(),
	url: z.string().url(),
	text: z.string(),
	sentiment: z.number().nullable(),
});
export type EventMediaType = z.infer<typeof eventMediaZodSchema>;

const parsedEventMediaCoverageZodSchema = eventMediaZodSchema
	.omit({ date: true })
	.merge(z.object({ date: z.date() }));
export type ParsedEventMediaType = z.infer<
	typeof parsedEventMediaCoverageZodSchema
>;

const eventMediaDataTypeZodSchema = z.array(eventMediaZodSchema);

const mediaCoverageDataResponseTypeZodSchema = z.object({
	data: eventMediaDataTypeZodSchema,
	query: eventMediaOutputQueryZodSchema,
});

export async function getEventMediaData({
	eventId,
	organizers,
	topic = "climate_change",
	from,
	to,
	mediaSource = "news_online",
}: EventMediaInputQueryType) {
	const body = eventMediaOutputQueryZodSchema.parse({
		event_id: eventId,
		...formatInput({ from, to, organizers, mediaSource, topic }),
	});
	const json = await fetchApiData({
		endpoint: "fulltexts",
		body,
	});
	return validateGetDataResponse(json);
}

function validateGetDataResponse(response: unknown): ParsedEventMediaType[] {
	try {
		const parsedResponse =
			mediaCoverageDataResponseTypeZodSchema.parse(response);
		const media = parsedResponse.data.map((m) => ({
			...m,
			date: parse(m.date, "yyyy-MM-dd", new Date()),
		}));
		return parsedEventMediaCoverageZodSchema.array().parse(media);
	} catch (error) {
		throw formatZodError(error);
	}
}
