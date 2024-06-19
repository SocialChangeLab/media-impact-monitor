"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { extractEventOrganisations, getEventsData } from "./eventsUtil";

function useEvents({
	from: inputFrom,
	to: inputTo,
}: { from?: Date; to?: Date } = {}) {
	const queryClient = useQueryClient();
	const filterStore = useFiltersStore((state) => ({
		from: state.from,
		to: state.to,
		fromDateString: state.fromDateString,
		toDateString: state.toDateString,
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
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

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
