"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfDay, format, isAfter, isBefore } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { extractEventOrganisations, getEventsData } from "./eventsUtil";

function useEvents({
	from: inputFrom,
	to: inputTo,
}: { from?: Date; to?: Date } = {}) {
	const loadedAllData = useRef(false);
	const queryClient = useQueryClient();
	const filterStore = useFiltersStore((state) => ({
		from: state.from,
		to: state.to,
		fromDateString: state.fromDateString,
		toDateString: state.toDateString,
		defaultFrom: state.defaultFrom,
		defaultTo: state.defaultTo,
	}));
	const from = inputFrom ?? filterStore.from;
	const to = inputTo ?? filterStore.to;
	const fromDateString = inputFrom
		? format(inputFrom, "yyyy-MM-dd")
		: filterStore.fromDateString;
	const toDateString = inputTo
		? format(inputTo, "yyyy-MM-dd")
		: filterStore.toDateString;
	const queryKey = loadedAllData.current
		? ["events"]
		: ["events", fromDateString, toDateString];
	const query = useQuery({
		queryKey,
		queryFn: async () => await getEventsData({ from, to }),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});
	const { data, error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching events: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ignore irrelevant dependencies. Only caring about the initial success
	useEffect(() => {
		if (loadedAllData.current) return;
		if (!query.isSuccess) return;
		getEventsData({
			from: filterStore.from,
			to: filterStore.to,
		}).then((data) => {
			queryClient.setQueryData(["events"], data);
			loadedAllData.current = true;
		});
	}, [query.isSuccess]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Using the fromDateString and toDateString to avoid the exact date (which changes on each render) to be used as dependencies of the useEffect
	const events = useMemo(() => {
		return (data ?? []).filter((e) => {
			if (!e.date) return false;
			const beforeFrom = isBefore(e.date, from);
			const afterTo = isAfter(e.date, to);
			if (beforeFrom || afterTo) return false;
			return true;
		});
	}, [data, fromDateString, toDateString]);

	const organisations = useMemo(
		() => extractEventOrganisations(events),
		[events],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: The queryClient should never change and if it does it shouldn't retrigger the useEffect
	useEffect(() => {
		if (!data || data.length === 0) return;
		for (const event of data) {
			queryClient.setQueryData(["events", event.event_id], event);
		}
	}, [data]);

	return {
		...query,
		data: { events, organisations },
	};
}

export default useEvents;
