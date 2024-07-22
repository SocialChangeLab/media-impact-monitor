import {
	type MediaSourceType,
	datasetEndDate,
	datasetStartDate,
} from "@/stores/filtersStore";
import { format } from "date-fns";
import type { EventOrganizerSlugType, OrganisationType } from "./eventsUtil";

export async function fetchApiData({
	endpoint,
	body,
}: {
	endpoint: string;
	body: Record<string, unknown>;
}) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!apiUrl)
		throw new Error("NEXT_PUBLIC_API_URL env variable is not defined");
	const response = await fetch(`${apiUrl}/${endpoint}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		next: {
			revalidate: 3600 * 4,
		},
	});

	if (!response.ok) {
		const message = `An error has occured: ${response.statusText} ${response.status}`;
		throw new Error(`ApiFetchError&&&${message}`);
	}

	// Check if the response is a success
	if (response.status >= 200 && response.status < 300) {
		return await response.json();
	}

	throw new Error(`ApiFetchError&&&${response.statusText}`);
}

export function formatInput(
	input: Partial<{
		from: Date;
		to: Date;
		mediaSource: MediaSourceType;
		organizers: EventOrganizerSlugType[];
		eventId: string;
		topic: string;
	}>,
	allOrganisations: OrganisationType[],
) {
	const { from, to } = input;
	const organizers =
		input.organizers && input.organizers.length > 0
			? input.organizers
			: undefined;
	const media_source = input.mediaSource ? input.mediaSource : undefined;
	const event_id = input.eventId ? input.eventId : undefined;
	const organisationNames = allOrganisations
		.filter(({ slug }) => organizers?.includes(slug))
		.map(({ name }) => name);
	const normalizedInput = {
		...(organizers && organizers.length > 0
			? { organizers: organisationNames }
			: {}),
		...(media_source ? { media_source } : {}),
		...(event_id ? { event_id } : {}),
		topic: input.topic || "climate_change",
	};
	if (!from || !to)
		return {
			...input,
			start_date: format(datasetStartDate, "yyyy-MM-dd"),
			end_date: format(datasetEndDate, "yyyy-MM-dd"),
			...normalizedInput,
		};
	return {
		...input,
		start_date: format(from, "yyyy-MM-dd"),
		end_date: format(to, "yyyy-MM-dd"),
		...normalizedInput,
	};
}
