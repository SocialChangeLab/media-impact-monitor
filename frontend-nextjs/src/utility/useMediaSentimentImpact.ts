"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import { getMediaSentimentImpactData } from "./mediaSentimentImpactUtil";

function useMediaSentimentImpactData(organizer: string | undefined) {
	const { from, to, mediaSource } = useFiltersStore(
		({ from, to, mediaSource }) => ({ from, to, mediaSource }),
	);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = [
		"mediaSentimentImpact",
		organizer,
		fromDateString,
		toDateString,
		mediaSource,
	];
	const query = useQuery({
		queryKey,
		queryFn: async () => {
			if (organizer === undefined) return undefined;
			return await getMediaSentimentImpactData({
				from,
				to,
				organizer,
				mediaSource,
			});
		},
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
		enabled: organizer !== undefined,
	});
	const { error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching media sentiment impact data: ${error}`, {
			important: true,
			dismissible: true,
			duration: 1000000,
		});
	}, [error]);

	return query;
}

export default useMediaSentimentImpactData;
