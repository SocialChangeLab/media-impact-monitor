"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import {
	type UseQueryResult,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { getTime } from "date-fns";
import { useEffect, useMemo } from "react";
import {
	type OrganisationType,
	type ParsedEventType,
	extractEventOrganisations,
	getEventsData,
} from "./eventsUtil";
import { getStaleTime } from "./queryUtil";
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
		fromTime: getTime(state.from),
		to: state.to,
		toTime: getTime(state.to),
		fromDateString: state.fromDateString,
		toDateString: state.toDateString,
		organizers: state.organizers,
	}));
	const queryKey = ["events"];
	const query = useQuery({
		queryKey,
		queryFn: async () => await getEventsData(undefined, today),
		staleTime: getStaleTime(today),
	});
	const { data, error } = query;

	useQueryErrorToast("protests", error);

	const organisersKey = useMemo(
		() => filterStore.organizers.sort().join("-"),
		[filterStore.organizers],
	);
	const events = useMemo(() => {
		return (data ?? []).filter((e) => {
			if (!e.date) return false;
			const beforeFrom = e.time < filterStore.fromTime;
			const afterTo = e.time > filterStore.toTime;
			if (beforeFrom || afterTo) return false;
			return true;
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, filterStore.fromDateString, filterStore.toDateString]);

	const eventFilteredByOrganizers = useMemo(() => {
		if (filterStore.organizers.length === 0) return events;
		return events.filter((e) =>
			filterStore.organizers.find((orgSlug) =>
				e.organizers.find((x) => x.slug === orgSlug),
			),
		);
	// eslint-disable-next-line react-hooks/exhaustive-deps
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

	useEffect(() => {
		if (!data || data.length === 0) return;
		for (const event of data) {
			queryClient.setQueryData(["events", event.event_id], event);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
