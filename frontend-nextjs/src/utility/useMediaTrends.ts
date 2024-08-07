"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useMemo } from "react";
import slugify from "slugify";
import { type TrendQueryProps, getMediaTrendData } from "./mediaTrendUtil";
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaTrends({
	trend_type,
	sentiment_target,
}: Pick<TrendQueryProps, "trend_type" | "sentiment_target">) {
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
			await getMediaTrendData({
				trend_type,
				sentiment_target,
				params: {
					from,
					to,
					organizers,
					mediaSource,
				},
				allOrganisations: data.organisations || [],
			}),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});

	useQueryErrorToast(`media ${trend_type} trends`, query.error);

	return query;
}

export default useMediaTrends;
