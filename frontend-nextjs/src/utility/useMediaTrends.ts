"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import { useQuery } from "@tanstack/react-query";
import slugify from "slugify";
import { type TrendQueryProps, getMediaTrendData } from "./mediaTrendUtil";
import { getStaleTime } from "./queryUtil";
import useEvents from "./useEvents";
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
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const mediaSource = useFiltersStore(({ mediaSource }) => mediaSource);
	const fromDateString = useFiltersStore(({ fromDateString }) => fromDateString);
	const toDateString = useFiltersStore(({ toDateString }) => toDateString);
	const organizersKey = useFiltersStore(
		({ organizers }) =>
			organizers
				.map((o) => slugify(o, { lower: true, strict: true }))
				.sort()
				.join("-"),
	);
	const { data } = useEvents();
	const { today } = useToday();
	const queryKey = [
		"mediaTrends",
		trend_type,
		sentiment_target,
		fromDateString,
		toDateString,
		organizersKey,
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
						organizers,
						mediaSource,
					},
					allOrganisations: data.organisations || [],
				},
				today,
			),
		staleTime: getStaleTime(today),
		enabled,
	});

	useQueryErrorToast(`media ${trend_type} trends`, query.error);

	return query;
}

export default useMediaTrends;
