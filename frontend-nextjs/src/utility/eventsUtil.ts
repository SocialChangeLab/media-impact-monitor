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
import type { TopicType } from "@/stores/filtersStore";

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
// Validate the wire contract before adding local chart compatibility fields.
const acledSummaryZodSchema = z.object({
	summary_id: z.string().min(1),
	source: z.literal("acled"),
	date: z.iso.date(),
	organizers: z.array(z.string()),
	size_number: z.number().nonnegative().nullable(),
	event_count: z.number().int().positive(),
	unknown_size_count: z.number().int().nonnegative(),
}).strict().refine(
	(x) => x.unknown_size_count <= x.event_count &&
		((x.size_number === null) === (x.unknown_size_count === x.event_count)),
	{ message: "Inconsistent summary size counts" },
);
const publicEventZodSchema = z.union([
	acledSummaryZodSchema.transform((summary) => ({
		...summary,
		event_id: summary.summary_id,
		event_type: "",
		country: null,
		region: null,
		city: null,
		size_text: null,
		description: "",
	})),
	eventZodSchema.refine((event) => event.source !== "acled"),
]);
const localEventZodSchema = eventZodSchema.extend({
	summary_id: z.string().optional(),
	event_count: z.number().int().positive().optional(),
	unknown_size_count: z.number().int().nonnegative().optional(),
});
export type EventType = z.infer<typeof localEventZodSchema>;

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

const parsedEventZodSchema = localEventZodSchema
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
	data: z.array(publicEventZodSchema),
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
});

export async function getEventsData(
	params?: {
		from?: Date;
		to?: Date;
		topic?: TopicType;
	},
	today = defaultToday,
): Promise<EventsDataType> {
	const json = await fetchApiData({
		endpoint: "events?view=summary-v1",
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
	return allEvents.find((x) => x.source !== "acled" && x.event_id === id);
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


export function getEventCount(event: Pick<ParsedEventType, "event_count">): number {
	return event.event_count ?? 1;
}

export function summarizeEvents(events: ParsedEventType[]) {
	return events.reduce((total, event) => ({
		eventCount: total.eventCount + getEventCount(event),
		knownSize: event.size_number === null ? total.knownSize : (total.knownSize ?? 0) + event.size_number,
		unknownSizeCount: total.unknownSizeCount + (event.unknown_size_count ?? (event.size_number === null ? getEventCount(event) : 0)),
	}), { eventCount: 0, knownSize: null as number | null, unknownSizeCount: 0 });
}

// Shared organizations that appear in both climate and Gaza contexts
// These must have consistent colors across both topics
const sharedOrganizations = {
	// Political parties
	"The Greens": `var(--categorical-color-8)`, // Yellow
	"The Left": `var(--categorical-color-1)`, // Pink
	"SPD: Social Democratic Party of Germany": `var(--categorical-color-12)`, // Red
	"CDU: Christian Democratic Union of Germany": `var(--categorical-color-13)`, // Blue-gray
	"MLPD: Marxist-Leninist Party of Germany": `var(--categorical-color-11)`, // Orange
	"FDP: Free Democratic Party": `var(--categorical-color-9)`, // Light purple
	"CSU: Christian Social Union in Bavaria": `var(--categorical-color-10)`, // Light pink
	
	// Organizations active in both contexts
	"Fridays for Future": `var(--categorical-color-6)`, // Green (climate org also in Gaza solidarity)
	"Amnesty International": `#ffee65`, // Yellow
	Attac: `#bd7ebe`, // Purple
	"REBELL: Youth League Rebel": `#fd7f6f`, // Light red
	Antifa: `#8bd3c7`, // Mint
	
	// Trade unions (appear in both contexts)
	"DGB: German Trade Union Confederation": `#7eb0d5`, // Light blue
	"Ver.di: United Services Union": `#f46a9b`, // Pink
	"IGM: Industrial Union of Metalworkers": `#8bd3c7`, // Mint
};

// Climate-specific organizations
const climateOnlyOrganizations = {
	"Last Generation": `var(--categorical-color-5)`, // Red
	"Extinction Rebellion": `var(--categorical-color-7)`, // Purple
	BUND: `var(--categorical-color-14)`, // Dark green
	NABU: `var(--categorical-color-2)`, // Blue
	Greenpeace: `var(--categorical-color-3)`, // Orange
	"Ende Gelaende": `var(--categorical-color-4)`, // Teal
};

// Gaza-specific organizations
const gazaOnlyOrganizations = {
	"Palestinian Group": `#d53d4f`, // Palestinian red
	"Jewish Group": `#3288bd`, // Blue (Jewish solidarity)
	"Israeli Group": `#fdae61`, // Orange (Israeli peace groups)
	"BDS: Boycott, Divestment and Sanctions": `#229e74`, // BDS green
	"Arab Group": `#66c2a5`, // Teal
	"Muslim Group": `#bd7ebe`, // Purple
	"Samidoun: Palestinian Prisoner Solidarity Network": `#ef9b20`, // Orange
	"NGPM: Network of the German Peace Movement": `#b2e061`, // Light green
	"DIG: German-Israeli Society": `#beb9db`, // Light purple
	"Protestant Christian Group": `#fdcce5`, // Light pink
	"Catholic Christian Group": `#ea5545`, // Red-orange
	"Evangelical Christian Group": `#327483`, // Blue-green
	"Pax Christi": `#7ea73f`, // Green
	"IL: Interventionist Left": `#ffb55a`, // Light orange
};


// Topic-specific organization maps for filtering
export const climateRelevantOrganizations = Object.fromEntries(
	Object.entries({
		...sharedOrganizations,
		...climateOnlyOrganizations,
	}).map(([key, value]) => [
		slugify(key, { lower: true, strict: true }),
		value,
	]),
);

export const gazaRelevantOrganizations = Object.fromEntries(
	Object.entries({
		...sharedOrganizations,
		...gazaOnlyOrganizations,
	}).map(([key, value]) => [
		slugify(key, { lower: true, strict: true }),
		value,
	]),
);

export function extractEventOrganisations(
	events: ParsedEventType[],
	topic?: TopicType,
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
			).reduce((total, event) => total + getEventCount(event), 0),
		}))
		.sort((a, b) => b.count - a.count)
		.map((organizer, idx) => {
			if (organizer.name.toLocaleLowerCase().trim() === "") {
				return {
					slug: "unknown-organisation" as EventOrganizerSlugType,
					name: "Unknown organisation",
					color: "var(--grayMed)",
					count: events.filter((event) => event.organizers.some((org) => !org.name.trim()))
						.reduce((total, event) => total + getEventCount(event), 0),
					isMain: false,
				};
			}
			// Use topic-specific color mapping to only highlight relevant organizations
			const getTopicRelevantColorMap = () => {
				if (topic === "gaza_crisis") return gazaRelevantOrganizations;
				if (topic === "climate_change") return climateRelevantOrganizations;
				return climateRelevantOrganizations; // Fallback to climate colors
			};
			
			const topicColorMap = getTopicRelevantColorMap();
			const color = topicColorMap[organizer.slug as keyof typeof topicColorMap];
			
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
	// Sort main organizations (with distinctive colors) first
	if (a.isMain && !b.isMain) return -1;
	if (!a.isMain && b.isMain) return 1;
	
	// For organizations of the same type (both main or both not main), sort by name
	const nameComparison = a.name.localeCompare(b.name);
	if (nameComparison === 1) return 1;
	if (nameComparison === -1) return -1;
	return 0;
}
