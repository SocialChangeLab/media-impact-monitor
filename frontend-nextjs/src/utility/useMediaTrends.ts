"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import slugify from "slugify";
import { format } from "./dateUtil";
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
