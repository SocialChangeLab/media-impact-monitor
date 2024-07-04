"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getMediaSentimentData } from "./mediaSentimentUtil";

function useMediaSentimentData() {
	const { from, to, organizers } = useFiltersStore(
		({ from, to, organizers }) => ({ from, to, organizers }),
	);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const organizersKey = useMemo(
		() => organizers.sort().join("-"),
		[organizers],
	);
	const queryKey = [
		"mediaSentiment",
		fromDateString,
		toDateString,
		organizersKey,
	];
	const query = useQuery({
		queryKey,
		queryFn: async () => await getMediaSentimentData({ from, to, organizers }),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});
	const { error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching media sentiment data: ${error}`, {
			important: true,
			dismissible: true,
			duration: 1000000,
		});
	}, [error]);

	return query;
}

export default useMediaSentimentData;
