"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import type { EventOrganizerSlugType } from "./eventsUtil";
import { getMediaSentimentImpactData } from "./mediaSentimentImpactUtil";
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaSentimentImpactData(
	organizer: EventOrganizerSlugType | undefined,
) {
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
	const { data } = useEvents();
	const query = useQuery({
		queryKey,
		queryFn: async () => {
			if (organizer === undefined) return undefined;
			return await getMediaSentimentImpactData(
				{
					from,
					to,
					organizer,
					mediaSource,
				},
				data?.organisations || [],
			);
		},
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
		enabled: organizer !== undefined && data?.organisations?.length > 0,
	});

	useQueryErrorToast("media sentiment impact", query.error);

	return query;
}

export default useMediaSentimentImpactData;
