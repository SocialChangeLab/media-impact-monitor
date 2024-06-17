import { endOfToday, format, parse, startOfDay, startOfWeek } from "date-fns";
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
});
export type EventType = z.infer<typeof eventZodSchema>;

const parsedEventZodSchema = eventZodSchema.omit({ date: true }).extend({
	date: z.date(),
	year: z.number(),
	month: z.number(),
	week: z.number(),
	day: z.number(),
	time: z.number(),
});
export type ParsedEventType = z.infer<typeof parsedEventZodSchema>;

const colorTypeZodSchema = z.string();
export type ColorType = z.infer<typeof colorTypeZodSchema>;

const organisationZodSchema = z.object({
	name: z.string(),
	count: z.number(),
	color: colorTypeZodSchema,
	isMain: z.boolean().default(false),
});
export type OrganisationType = z.infer<typeof organisationZodSchema>;

const eventDataTypeZodSchema = z.array(parsedEventZodSchema);
export type EventsDataType = z.infer<typeof eventDataTypeZodSchema>;

const eventDataResponseTypeZodSchema = z.object({
	data: z.array(eventZodSchema),
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
				: {
						start_date: "2020-01-01",
						end_date: format(endOfToday(), "yyyy-MM-dd"),
					}),
		},
		// fallbackFilePathContent: (await import("../data/fallbackProtests.json"))
		// 	.default,
	});
	return validateGetDataResponse(json);
}

export async function getEventData(
	id: string,
): Promise<ParsedEventType | undefined> {
	const allEvents = await getEventsData();
	return allEvents.find((x) => x.event_id === id);
}

const today = new Date();
function validateGetDataResponse(response: unknown): ParsedEventType[] {
	try {
		const parsedResponse = eventDataResponseTypeZodSchema.parse(response);
		const eventsWithFixedOrgs = parsedResponse.data
			.filter((x) => isValidISODateString(x.date))
			.map((x) => {
				const date = startOfDay(parse(x.date, "yyyy-MM-dd", today));
				return {
					...x,
					date,
					organizers: x.organizers ?? [],
					year: date.getUTCFullYear(),
					month: date.getUTCMonth(),
					week: startOfWeek(date, { weekStartsOn: 1 }).getTime(),
					day: date.getUTCDate(),
					time: date.getTime(),
				};
			})
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return parsedEventZodSchema.array().parse(eventsWithFixedOrgs);
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

export const distinctiveColors = [
	`var(--categorical-color-1)`,
	`var(--categorical-color-2)`,
	`var(--categorical-color-3)`,
	`var(--categorical-color-4)`,
	`var(--categorical-color-5)`,
	`var(--categorical-color-6)`,
	`var(--categorical-color-7)`,
	`var(--categorical-color-8)`,
	`var(--categorical-color-9)`,
	`var(--categorical-color-10)`,
	`var(--categorical-color-11)`,
	`var(--categorical-color-12)`,
	"var(--categorical-color-13)",
	"var(--categorical-color-14)",
];

export function extractEventOrganisations(
	events: ParsedEventType[],
): OrganisationType[] {
	const organisationStrings = [
		...events
			.reduce((acc, event) => {
				for (const organizer of event.organizers ?? []) acc.add(organizer);
				return acc;
			}, new Set<string>())
			.values(),
	];
	return organisationStrings
		.map((organizer) => ({
			name: organizer,
			count: events.filter((x) => x.organizers?.includes(organizer)).length,
		}))
		.sort((a, b) => b.count - a.count)
		.map((organizer, idx) => {
			if (organizer.name.toLocaleLowerCase().trim() === "") {
				return {
					name: "Unknown organisation",
					color: "var(--grayMed)",
					count: events.filter((x) => x.organizers?.filter((x) => !x)).length,
					isMain: false,
				};
			}
			const color = distinctiveColors[idx];
			return {
				...organizer,
				color: color ?? "var(--grayDark)",
				isMain: idx < distinctiveColors.length,
			};
		});
}
