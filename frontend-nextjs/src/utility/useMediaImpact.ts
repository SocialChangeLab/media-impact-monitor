"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import type { EventOrganizerSlugType } from "./eventsUtil";
import { getMediaImpactData } from "./mediaImpactUtil";
import type { TrendQueryProps } from "./mediaTrendUtil";
import { getStaleTime } from "./queryUtil";
import { today } from "./today";
import { useAllOrganisations } from "./useOrganisations";
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
	const from = useFiltersStore(({ from }) => from);
	const to = useFiltersStore(({ to }) => to);
	const mediaSource = useFiltersStore(({ mediaSource }) => mediaSource);
	const fromDateString = useFiltersStore(({ fromDateString }) => fromDateString);
	const toDateString = useFiltersStore(({ toDateString }) => toDateString);
	const queryKey = [
		"mediaImpact",
		trend_type,
		sentiment_target,
		organizer,
		fromDateString,
		toDateString,
		mediaSource,
	];
	const { organisations, isLoading } = useAllOrganisations();
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
				allOrganisations: organisations || [],
			});
		},
		staleTime: getStaleTime(today),
		enabled: organizer !== undefined && organisations?.length > 0 && !isLoading,
	});

	useQueryErrorToast(`media ${trend_type} impact`, query.error);

	return query;
}

export default useMediaImpactData;
