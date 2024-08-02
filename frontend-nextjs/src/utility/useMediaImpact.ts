"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import type { EventOrganizerSlugType } from "./eventsUtil";
import { getMediaImpactData } from "./mediaImpactUtil";
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaImpactData(
	organizer: EventOrganizerSlugType | undefined,
	type: "keywords" | "sentiment",
) {
	const { from, to, mediaSource } = useFiltersStore(
		({ from, to, mediaSource }) => ({ from, to, mediaSource }),
	);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = [
		"mediaImpact",
		type,
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
			return await getMediaImpactData(
				type,
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

	useQueryErrorToast(`media ${type} impact`, query.error);

	return query;
}

export default useMediaImpactData;
