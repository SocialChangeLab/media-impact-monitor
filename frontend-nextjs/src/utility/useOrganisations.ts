import { useQuery } from "@tanstack/react-query";
import {
	extractEventOrganisations,
	type EventOrganizerSlugType,
} from "./eventsUtil";
import { useAllEvents } from "./useEvents";

export function useAllOrganisations() {
	const { allEvents, isLoading } = useAllEvents();

	const query = useQuery({
		queryKey: ["organisations"],
		queryFn: () => {
			if (!allEvents || allEvents.length === 0) return [];
			return extractEventOrganisations(allEvents);
		},
		enabled: !isLoading && allEvents.length > 0,
	});

	return {
		...query,
		organisations: query.data ?? [],
	};
}

export function useOrganisation(slug: EventOrganizerSlugType | undefined) {
	const { organisations, isLoading } = useAllOrganisations();

	const query = useQuery({
		queryKey: ["organisations", slug],
		queryFn: () =>
			slug ? organisations.find(({ slug: s }) => s === slug) : undefined,
		enabled: !!slug && !isLoading,
	});

	return {
		...query,
		organisation: query.data,
	};
}
