import { format, parse } from "date-fns";
import { ZodError, z } from "zod";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import { fetchApiData } from "./fetchUtil";

const eventZodSchema = z.object({
	event_id: z.string(),
	event_type: z.string(),
	source: z.string(),
	date: z.string(),
	country: z.string().nullable(),
	region: z.string().nullable(),
	city: z.string().nullable(),
	organizers: z.array(z.string()).default([]),
	size_text: z.string().nullable(),
	size_number: z.number().nullable(),
	description: z.string(),
	chart_position: z.number(),
});
export type EventType = z.infer<typeof eventZodSchema>;

const colorTypeZodSchema = z.string();
export type ColorType = z.infer<typeof colorTypeZodSchema>;

const organisationZodSchema = z.object({
	name: z.string(),
	count: z.number(),
	color: colorTypeZodSchema,
	isMain: z.boolean().default(false),
});
export type OrganisationType = z.infer<typeof organisationZodSchema>;

const eventDataTypeZodSchema = z.array(eventZodSchema);
export type EventsDataType = z.infer<typeof eventDataTypeZodSchema>;

const eventDataResponseTypeZodSchema = z.object({
	data: eventDataTypeZodSchema,
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
});

export async function getEventsData(params?: {
	from?: Date;
	to?: Date;
}): Promise<EventsDataType> {
	const json = await fetchApiData({
		endpoint: "events",
		body: {
			source: "acled",
			topic: "climate_change",
			...(params?.from && params?.to
				? {
						start_date: format(params?.from, "yyyy-MM-dd"),
						end_date: format(params?.to, "yyyy-MM-dd"),
					}
				: {}),
		},
		fallbackFilePathContent: (await import("../data/fallbackProtests.json"))
			.default,
	});
	return validateGetDataResponse(json);
}

export async function getEventData(id: string): Promise<EventType | undefined> {
	const allEvents = await getEventsData();
	return allEvents.find((x) => x.event_id === id);
}

function validateGetDataResponse(response: unknown): EventType[] {
	try {
		const parsedResponse = eventDataResponseTypeZodSchema.parse(response);
		const eventsWithFixedOrgs = parsedResponse.data
			.filter((x) => isValidISODateString(x.date))
			.map((x) => ({
				...x,
				date: parse(x.date, "yyyy-MM-dd", new Date()).toISOString(),
				organizers: x.organizers ?? [],
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return eventsWithFixedOrgs;
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
