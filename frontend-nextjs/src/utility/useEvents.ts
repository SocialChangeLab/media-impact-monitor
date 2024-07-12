"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import {
	type UseQueryResult,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
	type OrganisationType,
	type ParsedEventType,
	extractEventOrganisations,
	getEventsData,
} from "./eventsUtil";

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
		queryFn: async () => await getEventsData(),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});
	const { data, error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching events: ${error}`, {
			important: true,
			dismissible: true,
			duration: 1000000,
		});
	}, [error]);

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

	const selectedOrganisations = useMemo(() => {
		if (filterStore.organizers.length === 0) return organisations;
		const selectedOrs = organisations.filter((org) =>
			filterStore.organizers.find((o) => o === org.slug),
		);
		return selectedOrs.length === 0 ? organisations : selectedOrs;
	}, [filterStore.organizers, organisations]);

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
