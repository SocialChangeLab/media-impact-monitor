"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfDay, isAfter, isBefore } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { extractEventOrganisations, getEventsData } from "./eventsUtil";

function useEvents({
	from: inputFrom,
	to: inputTo,
}: { from?: Date; to?: Date } = {}) {
	const queryClient = useQueryClient();
	const filterStore = useFiltersStore(({ from, to }) => ({ from, to }));
	const from = inputFrom ?? filterStore.from;
	const to = inputTo ?? filterStore.to;
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
			const beforeFrom = isBefore(e.date, from);
			const afterTo = isAfter(e.date, to);
			if (beforeFrom || afterTo) return false;
			return true;
		});
	}, [data, query.isSuccess]);

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
