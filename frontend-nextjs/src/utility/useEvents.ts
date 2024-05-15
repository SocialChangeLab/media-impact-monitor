"use client";
import { defaultFrom, defaultTo } from "@/app/(events)/config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getEventsData } from "./eventsUtil";
import useQueryParams from "./useQueryParams";

function useEvents() {
	const { searchParams } = useQueryParams();
	const [from, setFrom] = useState(new Date(defaultFrom));
	const [to, setTo] = useState(new Date(defaultTo));
	const queryKey = [
		"events",
		format(from, "yyyy-MM-dd"),
		format(to, "yyyy-MM-dd"),
	];
	const { data, isPending, error } = useSuspenseQuery({
		queryKey,
		queryFn: async () => {
			const { data, error } = await getEventsData({ from, to });
			if (error) throw new Error(error);
			return data;
		},
	});

	useEffect(() => {
		if (!error) return;
		if (toast.length > 0) return;
		const to = setTimeout(() => {
			toast.error(`Error fetching events: ${error}`, {
				important: true,
				dismissible: false,
				duration: 1000000,
			});
		}, 10);
		return () => clearTimeout(to);
	}, [error]);

	const searchParamsFrom = searchParams?.from?.toISOString();
	const searchParamsTo = searchParams?.to?.toISOString();
	useEffect(() => {
		if (!searchParamsFrom || !searchParamsTo) return;
		setFrom(new Date(searchParamsFrom));
		setTo(new Date(searchParamsTo));
	}, [searchParamsFrom, searchParamsTo]);

	const setDateRange = useCallback(({ from, to }: { from: Date; to: Date }) => {
		setFrom(from);
		setTo(to);
	}, []);

	return {
		data,
		isPending,
		error,
		from,
		to,
		setDateRange,
	};
}

export default useEvents;
