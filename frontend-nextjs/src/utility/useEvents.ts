"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getEventsData } from "./eventsUtil";

function useEvents(
	initialData?: Awaited<ReturnType<typeof getEventsData>>["data"],
) {
	const filtersStore = useFiltersStore();

	const [from, setFrom] = useState(filtersStore.from);
	const [to, setTo] = useState(filtersStore.to);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["events", fromDateString, toDateString];
	const { data, isPending, error } = useSuspenseQuery({
		queryKey,
		queryFn: async () => {
			const { data, error } = await getEventsData({ from, to });
			return { ...data, error: error ? new Error(error) : null };
		},
		initialData: initialData && {
			events: initialData.events,
			organisations: initialData.organisations,
			error: null,
		},
	});

	useEffect(() => {
		if (!error) return;
		if (toast.length > 0) return;
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

	return {
		data,
		isPending,
		error: data.error || error,
		from,
		to,
		setDateRange,
	};
}

export default useEvents;
