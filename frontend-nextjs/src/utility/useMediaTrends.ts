"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import { useQuery } from "@tanstack/react-query";
import { type TrendQueryProps, getMediaTrendData } from "./mediaTrendUtil";
import { getStaleTime } from "./queryUtil";
import { useAllOrganisations } from "./useOrganisations";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaTrends({
	trend_type,
	sentiment_target,
	enabled = true,
}: Pick<TrendQueryProps, "trend_type" | "sentiment_target"> & {
	enabled?: boolean;
}) {
	const from = useFiltersStore(({ from }) => from);
	const to = useFiltersStore(({ to }) => to);
	const mediaSource = useFiltersStore(({ mediaSource }) => mediaSource);
	const fromDateString = useFiltersStore(
		({ fromDateString }) => fromDateString,
	);
	const toDateString = useFiltersStore(({ toDateString }) => toDateString);
	const { organisations, isLoading } = useAllOrganisations();
	const { today } = useToday();
	const queryKey = [
		"mediaTrends",
		trend_type,
		sentiment_target,
		fromDateString,
		toDateString,
		mediaSource,
	];
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			await getMediaTrendData(
				{
					trend_type,
					sentiment_target,
					params: {
						from,
						to,
						mediaSource,
						organizers: [],
					},
					allOrganisations: organisations || [],
				},
				today,
			),
		staleTime: getStaleTime(today),
		enabled: enabled && !isLoading,
	});

	useQueryErrorToast(`media ${trend_type} trends`, query.error);

	return query;
}

export default useMediaTrends;
