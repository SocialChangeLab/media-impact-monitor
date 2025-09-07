import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { extractEventOrganisations, type EventOrganizerSlugType } from "./eventsUtil";
import { useAllEvents, useFilteredEvents } from "./useEvents";

export function useAllOrganisations() {
	const { allEvents, isLoading } = useAllEvents();
	const topic = useFiltersStore(({ topic }) => topic);

	const query = useQuery({
		queryKey: ["organisations", topic],
		queryFn: () => {
			if (!allEvents || allEvents.length === 0) return [];
			return extractEventOrganisations(allEvents, topic);
		},
		enabled: !isLoading && allEvents.length > 0,
	});

	return {
		...query,
		organisations: query.data ?? [],
	}
}

export function useFilteredEventsOrganisations() {
	const { filteredEvents, isLoading } = useFilteredEvents();
	const organizersKey = useOrganizersKey();
	const fromDateString = useFiltersStore(({ fromDateString }) => fromDateString);
	const toDateString = useFiltersStore(({ toDateString }) => toDateString);
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const topic = useFiltersStore(({ topic }) => topic);

	const query = useQuery({
		queryKey: ["filteredEventsOrganisations", organizersKey, fromDateString, toDateString, topic],
		queryFn: () => {
			if (!filteredEvents || filteredEvents.length === 0) return [];
			const events = organizers.length === 0 ? filteredEvents : filteredEvents.filter(
				(event) => event.organizers.find((org) => organizers.includes(org.slug))
			)
			return extractEventOrganisations(events, topic)
		},
		enabled: !isLoading && filteredEvents.length > 0,
	})

	return {
		...query,
		filteredEventsOrganisations: query.data ?? [],
	}
}

export function useOrganizersKey() {
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const organisersKey = useMemo(() => organizers.sort().join('-'), [organizers])
	return organisersKey
}

export function useSelectedOrganisations() {
	const { organisations, isLoading } = useAllOrganisations();
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const organizersKey = useOrganizersKey();

	const query = useQuery({
		queryKey: ["selectedOrganisations", organizersKey],
		queryFn: () => {
			if (organizers.length === 0) return organisations;
			const selectedOrs = organisations.filter((org) =>
				organizers.find((o) => o === org.slug),
			);
			return selectedOrs.length === 0 ? organisations : selectedOrs;
		},
		enabled: !isLoading && organisations.length > 0,
	})

	return {
		...query,
		selectedOrganisations: query.data ?? [],
	}
}

export function useOrganisation(slug: EventOrganizerSlugType | undefined) {
	const { organisations, isLoading } = useAllOrganisations();

	const query = useQuery({
		queryKey: ["organisations", slug],
		queryFn: () => slug ? organisations.find(({ slug: s }) => s === slug) : undefined,
		enabled: !!slug && !isLoading
	});

	return {
		...query,
		organisation: query.data,
	};
}
