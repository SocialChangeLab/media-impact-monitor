import slugify from "slugify";
import { z } from "zod";
import {
	comparableDateItemSchema,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { formatZodError } from "./zodUtil";

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

const eventOrganizerZodSchema = z.object({
	slug: z.string(),
	name: z.string(),
});
export type EventOrganizerType = z.infer<typeof eventOrganizerZodSchema>;

const parsedEventZodSchema = eventZodSchema
	.omit({ date: true, organizers: true })
	.merge(comparableDateItemSchema)
	.extend({
		organizers: z.array(eventOrganizerZodSchema),
	});
export type ParsedEventType = z.infer<typeof parsedEventZodSchema>;

const colorTypeZodSchema = z.string();
export type ColorType = z.infer<typeof colorTypeZodSchema>;

export const organisationZodSchema = eventOrganizerZodSchema.extend({
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
			...formatInput(params),
		},
	});
	return validateGetDataResponse(json);
}

export async function getEventData(
	id: string,
): Promise<ParsedEventType | undefined> {
	const allEvents = await getEventsData();
	return allEvents.find((x) => x.event_id === id);
}

function validateGetDataResponse(response: unknown): ParsedEventType[] {
	try {
		const parsedResponse = eventDataResponseTypeZodSchema.parse(response);
		const eventsWithFixedOrgs = parsedResponse.data
			.filter((x) => isValidISODateString(x.date))
			.map((x) => {
				return {
					...x,
					organizers: (x.organizers ?? []).map((x) => ({
						slug: slugify(x, { lower: true, strict: true }),
						name: x,
					})),
					...dateToComparableDateItem(x.date),
				};
			})
			.sort((a, b) => dateSortCompare(a.date, b.date));
		return parsedEventZodSchema.array().parse(eventsWithFixedOrgs);
	} catch (error) {
		throw formatZodError(error);
	}
}

export const distinctiveColorsMap = Object.fromEntries(
	Object.entries({
		"Fridays for Future": `var(--categorical-color-1)`,
		"Last Generation (Germany)": `var(--categorical-color-2)`,
		"Extinction Rebellion": `var(--categorical-color-3)`,
		BUND: `var(--categorical-color-4)`,
		Greenpeace: `var(--categorical-color-5)`,
		"Ver.di: United Services Union": `var(--categorical-color-6)`,
		"Ende Gelaende": `var(--categorical-color-7)`,
		"The Greens (Germany)": `var(--categorical-color-8)`,
		"MLPD: Marxist-Leninist Party of Germany": `var(--categorical-color-9)`,
		"The Left (Germany)": `var(--categorical-color-10)`,
		"ADFC: German Bicycle Club": `var(--categorical-color-11)`,
		"SPD: Social Democratic Party of Germany": `var(--categorical-color-12)`,
		"Government of Germany (2021-)": "var(--categorical-color-13)",
		"REBELL: Youth League Rebel": "var(--categorical-color-14)",
	}).map(([key, value]) => [
		slugify(key, { lower: true, strict: true }),
		value,
	]),
);

export function extractEventOrganisations(
	events: ParsedEventType[],
): OrganisationType[] {
	const organisationsMap = events.reduce((acc, event) => {
		for (const organizer of event.organizers ?? []) {
			acc.set(organizer.slug, organizer);
		}
		return acc;
	}, new Map<string, EventOrganizerType>());
	const organisations = Array.from(organisationsMap.values());
	return organisations
		.map((organizer) => ({
			...organizer,
			count: events.filter((x) =>
				x.organizers?.find((x) => x.slug === organizer.slug),
			).length,
		}))
		.sort((a, b) => b.count - a.count)
		.map((organizer, idx) => {
			if (organizer.name.toLocaleLowerCase().trim() === "") {
				return {
					slug: "unknown-organisation",
					name: "Unknown organisation",
					color: "var(--grayMed)",
					count: events.filter((x) => x.organizers?.filter((x) => !x)).length,
					isMain: false,
				};
			}
			const color =
				distinctiveColorsMap[
					organizer.slug as keyof typeof distinctiveColorsMap
				];
			return {
				...organizer,
				color: color ?? "var(--grayDark)",
				isMain: !!color,
			};
		});
}

export function compareOrganizationsByColors(
	a: OrganisationType,
	b: OrganisationType,
): -1 | 0 | 1 {
	if (a.isMain && !b.isMain) return -1;
	if (!a.isMain && b.isMain) return 1;
	if (a.isMain && b.isMain) {
		const mainNames = Object.keys(distinctiveColorsMap);
		const aIdx = mainNames.indexOf(a.slug);
		const bIdx = mainNames.indexOf(b.slug);
		if (aIdx > bIdx) return 1;
		if (aIdx < bIdx) return -1;
	}
	const nameComparison = a.name.localeCompare(b.name);
	if (nameComparison === 1) return 1;
	if (nameComparison === -1) return -1;
	return 0;
}
