"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { format } from "./dateUtil";
import type { EventOrganizerSlugType } from "./eventsUtil";
import { getMediaImpactData } from "./mediaImpactUtil";
import type { TrendQueryProps } from "./mediaTrendUtil";
import { getStaleTime } from "./queryUtil";
import { today } from "./today";
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaImpactData({
	organizer,
	trend_type,
	sentiment_target,
}: {
	organizer: EventOrganizerSlugType | undefined;
	trend_type: TrendQueryProps["trend_type"];
	sentiment_target: TrendQueryProps["sentiment_target"];
}) {
	const { from, to, mediaSource } = useFiltersStore(
		({ from, to, mediaSource }) => ({ from, to, mediaSource }),
	);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = [
		"mediaImpact",
		trend_type,
		sentiment_target,
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
			return await getMediaImpactData({
				trend_type,
				sentiment_target,
				params: {
					from,
					to,
					organizer,
					mediaSource,
				},
				allOrganisations: data?.organisations || [],
			});
		},
		staleTime: getStaleTime(today),
		enabled: organizer !== undefined && data?.organisations?.length > 0,
	});

	useQueryErrorToast(`media ${trend_type} impact`, query.error);

	return query;
}

export default useMediaImpactData;
