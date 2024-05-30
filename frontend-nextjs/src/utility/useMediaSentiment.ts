"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import { getMediaSentimentData } from "./mediaSentimentUtil";

function useMediaSentimentData(
	initialData?: Awaited<ReturnType<typeof getMediaSentimentData>>,
) {
	const { from, to } = useFiltersStore(({ from, to }) => ({ from, to }));
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["mediaSentiment", fromDateString, toDateString];
	const query = useQuery({
		queryKey,
		queryFn: async () => await getMediaSentimentData({ from, to }),
		initialData: initialData,
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});
	const { error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching media sentiment data: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

	return query;
}

export default useMediaSentimentData;
