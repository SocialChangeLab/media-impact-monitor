"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useEffect, useMemo } from "react";
import slugify from "slugify";
import { toast } from "sonner";
import { getMediaSentimentData } from "./mediaSentimentUtil";
import useEvents from "./useEvents";

function useMediaSentimentData() {
	const { from, to, organizers, mediaSource } = useFiltersStore(
		({ from, to, organizers, mediaSource }) => ({
			from,
			to,
			organizers,
			mediaSource,
		}),
	);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const organizersKey = useMemo(
		() =>
			organizers
				.map((o) => slugify(o, { lower: true, strict: true }))
				.sort()
				.join("-"),
		[organizers],
	);
	const queryKey = [
		"mediaSentiment",
		fromDateString,
		toDateString,
		organizersKey,
		mediaSource,
	];
	const { data } = useEvents();
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			await getMediaSentimentData(
				{ from, to, organizers, mediaSource },
				data?.organisations || [],
			),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});
	const { error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching media sentiment data: ${error}`, {
			important: true,
			dismissible: true,
			duration: 1000000,
			closeButton: true,
		});
	}, [error]);

	return query;
}

export default useMediaSentimentData;
