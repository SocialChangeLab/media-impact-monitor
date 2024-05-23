"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import {
	getMediaSentimentData,
	type MediaSentimentType,
} from "./mediaSentimentUtil";

function useMediaSentimentData(
	initialData?: Awaited<ReturnType<typeof getMediaSentimentData>>,
) {
	const { from, to } = useFiltersStore(({ from, to }) => ({ from, to }));
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["mediaSentiment", fromDateString, toDateString];
	const { data, isPending, error } = useQuery<MediaSentimentType[], Error>({
		queryKey,
		queryFn: async () => await getMediaSentimentData({ from, to }),
		initialData: initialData,
	});

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching media sentiment data: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

	return {
		data,
		isPending,
		error: error,
	};
}

export default useMediaSentimentData;
