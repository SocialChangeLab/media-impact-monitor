"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { endOfDay, format, isAfter, isBefore } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { extractEventOrganisations, getEventsData } from "./eventsUtil";

function useEvents() {
	const queryClient = useQueryClient();
	const { from, to } = useFiltersStore(({ from, to }) => ({
		from,
		to,
	}));
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["events"]; //, fromDateString, toDateString];
	const query = useSuspenseQuery({
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

	const events = useMemo(() => {
		return (data ?? []).filter((e) => {
			if (!e.date) return false;
			const beforeFrom = isBefore(e.date, from);
			const afterTo = isAfter(e.date, to);
			if (beforeFrom || afterTo) return false;
			return true;
		});
	}, [data, from, to]);

	const organisations = useMemo(
		() => extractEventOrganisations(events),
		[events],
	);

	useEffect(() => {
		if (!data) return;
		for (const event of data) {
			queryClient.setQueryData(["events", event.event_id], event);
		}
	}, [data, queryClient]);

	return {
		...query,
		data: { events, organisations },
	};
}

export default useEvents;
