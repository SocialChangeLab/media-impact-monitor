"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import {
	type UseQueryResult,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { useEffect, useMemo } from "react";
import {
	type OrganisationType,
	type ParsedEventType,
	extractEventOrganisations,
	getEventsData,
} from "./eventsUtil";
import useQueryErrorToast from "./useQueryErrorToast";

export type UseEventsReturnType = Omit<
	UseQueryResult<ParsedEventType[], unknown>,
	"data"
> & {
	data: {
		allEvents: ParsedEventType[];
		events: ParsedEventType[];
		eventsByOrgs: ParsedEventType[];
		organisations: OrganisationType[];
		selectedOrganisations: OrganisationType[];
	};
};

function useEvents({
	from: inputFrom,
	to: inputTo,
}: { from?: Date; to?: Date } = {}): UseEventsReturnType {
	const queryClient = useQueryClient();
	const { today } = useToday();
	const filterStore = useFiltersStore((state) => ({
		from: state.from,
		to: state.to,
		fromDateString: state.fromDateString,
		toDateString: state.toDateString,
		organizers: state.organizers,
	}));
	const fromTime = new Date(inputFrom ?? filterStore.from).getTime();
	const toTime = new Date(inputTo ?? filterStore.to).getTime();
	const queryKey = ["events"];
	const query = useQuery({
		queryKey,
		queryFn: async () => await getEventsData(undefined, today),
		staleTime: endOfDay(today).getTime() - today.getTime(),
	});
	const { data, error } = query;

	useQueryErrorToast("protests", error);

	const organisersKey = useMemo(
		() => filterStore.organizers.sort().join("-"),
		[filterStore.organizers],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Using the fromDateString and toDateString to avoid the exact date (which changes on each render) to be used as dependencies of the useEffect
	const events = useMemo(() => {
		return (data ?? []).filter((e) => {
			if (!e.date) return false;
			const beforeFrom = e.time < fromTime;
			const afterTo = e.time > toTime;
			if (beforeFrom || afterTo) return false;
			return true;
		});
	}, [data, filterStore.fromDateString, filterStore.toDateString]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Using the organisersKey to only re-render when the organizers change
	const eventFilteredByOrganizers = useMemo(() => {
		if (filterStore.organizers.length === 0) return events;
		return events.filter((e) =>
			filterStore.organizers.find((orgSlug) =>
				e.organizers.find((x) => x.slug === orgSlug),
			),
		);
	}, [events, organisersKey]);

	const organisations = useMemo(
		() => (data?.length ? extractEventOrganisations(data) : []),
		[data],
	);

	const orgsFromFilteredEvents = useMemo(
		() => (events.length ? extractEventOrganisations(events) : []),
		[events],
	);

	const selectedOrganisations = useMemo(() => {
		if (filterStore.organizers.length === 0) return orgsFromFilteredEvents;
		const selectedOrs = orgsFromFilteredEvents.filter((org) =>
			filterStore.organizers.find((o) => o === org.slug),
		);
		return selectedOrs.length === 0 ? orgsFromFilteredEvents : selectedOrs;
	}, [filterStore.organizers, orgsFromFilteredEvents]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: The queryClient should never change and if it does it shouldn't retrigger the useEffect
	useEffect(() => {
		if (!data || data.length === 0) return;
		for (const event of data) {
			queryClient.setQueryData(["events", event.event_id], event);
		}
	}, [data]);

	return {
		...query,
		data: {
			allEvents: data ?? [],
			events,
			eventsByOrgs: eventFilteredByOrganizers,
			organisations,
			selectedOrganisations,
		},
	};
}

export default useEvents;
