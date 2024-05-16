"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { extractEventOrganisations, getEventsData } from "./eventsUtil";

function useEvents(initialData?: Awaited<ReturnType<typeof getEventsData>>) {
	const filtersStore = useFiltersStore();

	const [from, setFrom] = useState(filtersStore.from);
	const [to, setTo] = useState(filtersStore.to);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["events", fromDateString, toDateString];
	const { data, isPending, error } = useQuery({
		queryKey,
		queryFn: async () => await getEventsData({ from, to }),
		initialData: initialData,
	});

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching events: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

	useEffect(() => {
		setFrom(filtersStore.from);
		setTo(filtersStore.to);
	}, [filtersStore.from, filtersStore.to]);

	const setDateRange = useCallback(
		({ from, to }: { from: Date; to: Date }) => {
			setFrom(from);
			setTo(to);
			filtersStore.setDateRange({ from, to });
		},
		[filtersStore.setDateRange],
	);

	const events = useMemo(() => {
		return (data ?? []).filter((e) => {
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

	return {
		data: { events, organisations },
		isPending,
		error: error,
		from,
		to,
		setDateRange,
	};
}

export default useEvents;
