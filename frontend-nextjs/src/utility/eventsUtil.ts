import { parse } from "date-fns";
import { ZodError, z } from "zod";
import { dateSortCompare, isValidISODateString } from "./dateUtil";
import type { AllowedParamsInputType } from "./searchParamsUtil";

export type Query<T> =
	| {
			data: T;
			isPending: false;
			error: null | string;
	  }
	| {
			data?: T;
			isPending: true;
			error: null;
	  };

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

const distinctiveTailwindColors = [
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

const colorTypeZodSchema = z.string();
export type ColorType = z.infer<typeof colorTypeZodSchema>;

const organisationZodSchema = z.object({
	name: z.string(),
	count: z.number(),
	color: colorTypeZodSchema,
	isMain: z.boolean().default(false),
});
export type OrganisationType = z.infer<typeof organisationZodSchema>;

const eventDataTypeZodSchema = z.object({
	events: z.array(eventZodSchema),
	organisations: z.array(organisationZodSchema),
});
export type EventsDataType = z.infer<typeof eventDataTypeZodSchema>;

const eventDataResponseTypeZodSchema = z.object({
	data: z.array(eventZodSchema),
	isPending: z.boolean().optional(),
	error: z.union([z.string(), z.null()]).optional(),
});

interface DataResponseType<DataType> {
	data: DataType;
	isPending: false;
	error: null | string;
}

export async function getEventsData(
	searchParams: AllowedParamsInputType = {},
): Promise<DataResponseType<EventsDataType>> {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!apiUrl)
		throw new Error("NEXT_PUBLIC_API_URL env variable is not defined");
	try {
		const response = await fetch(`${apiUrl}/events`, {
			cache: "no-store",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				source: "acled",
				topic: "climate_change",
			}),
		});
		const json = await response.json();
		const events = validateGetDataResponse(json);

		return {
			data: {
				events,
				organisations: extractEventOrganisations(events),
			},
			isPending: false,
			error: null,
		};
	} catch (error) {
		console.error(`Error fetching events: ${error}`);
		if (error instanceof ZodError) {
			console.log(`Invalid response format:`);
			for (const issue of error.issues) {
				console.log(`- ${issue.path}: ${issue.message}`);
			}
		}
		return {
			data: {
				events: [],
				organisations: [],
			},
			isPending: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function getEventData(
	id: string,
	searchParams: AllowedParamsInputType = {},
): Promise<DataResponseType<EventType | undefined>> {
	const allEvents = await getEventsData(searchParams);
	return {
		data: allEvents.data.events.find((x) => x.event_id === id),
		isPending: false,
		error: null,
	};
}

function extractEventOrganisations(events: EventType[]): OrganisationType[] {
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
			const color = distinctiveTailwindColors[idx];
			return {
				...organizer,
				color: color ?? "var(--grayDark)",
				isMain: idx < distinctiveTailwindColors.length,
			};
		});
}

function validateGetDataResponse(response: unknown): EventType[] {
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
}
