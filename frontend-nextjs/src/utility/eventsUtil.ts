import slugify from "slugify";
import { z } from "zod";
import {
	comparableDateItemSchema,
	dateToComparableDateItem,
} from "./comparableDateItemSchema";
import { dateSortCompare } from "./dateUtil";
import { fetchApiData, formatInput } from "./fetchUtil";
import { today as defaultToday } from "./today";
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

export const eventOrganizerSlugZodSchema = z
	.string()
	.brand("EventOrganizerSlug");
export type EventOrganizerSlugType = z.infer<
	typeof eventOrganizerSlugZodSchema
>;

const eventOrganizerZodSchema = z.object({
	slug: eventOrganizerSlugZodSchema,
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

export async function getEventsData(
	params?: {
		from?: Date;
		to?: Date;
	},
	today = defaultToday,
): Promise<EventsDataType> {
	const json = await fetchApiData({
		endpoint: "events",
		body: {
			source: "acled",
			...formatInput(params || {}, []),
		},
	});
	return validateGetDataResponse(json, today);
}

export async function getEventData(
	id: string,
	today = defaultToday,
): Promise<ParsedEventType | undefined> {
	const allEvents = await getEventsData(undefined, today);
	return allEvents.find((x) => x.event_id === id);
}

function validateGetDataResponse(
	response: unknown,
	today: Date,
): ParsedEventType[] {
	try {
		const parsedResponse = eventDataResponseTypeZodSchema.parse(response);
		const eventsWithFixedOrgs = parsedResponse.data
			.map((x) => ({
				...x,
				organizers: (x.organizers ?? []).map((x) => ({
					slug: slugify(x, { lower: true, strict: true }),
					name: x,
				})),
				...dateToComparableDateItem(x.date, today),
			}))
			.sort((a, b) => dateSortCompare(a.date, b.date, today));
		return parsedEventZodSchema.array().parse(eventsWithFixedOrgs);
	} catch (error) {
		throw formatZodError(error);
	}
}

export const distinctiveColorsMap = Object.fromEntries(
	Object.entries({
		"Fridays for Future": `var(--categorical-color-6)`,
		"Last Generation": `var(--categorical-color-5)`,
		"Extinction Rebellion": `var(--categorical-color-7)`,
		BUND: `var(--categorical-color-14)`,
		NABU: `var(--categorical-color-2)`,
		Greenpeace: `var(--categorical-color-3)`,
		"Ende Gelaende": `var(--categorical-color-4)`,
		"The Greens": `var(--categorical-color-8)`,
		"The Left": `var(--categorical-color-1)`,
		SPD: `var(--categorical-color-12)`,
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
					slug: "unknown-organisation" as EventOrganizerSlugType,
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
