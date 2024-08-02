"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useMemo } from "react";
import slugify from "slugify";
import { getMediaTrendData } from "./mediaTrendUtil";
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaTrends(type: "keywords" | "sentiment") {
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
		type,
		fromDateString,
		toDateString,
		organizersKey,
		mediaSource,
	];
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			await getMediaTrendData(
				type,
				{
					from,
					to,
					organizers,
					mediaSource,
				},
				data.organisations || [],
			),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});

	useQueryErrorToast(`media ${type} trends`, query.error);

	return query;
}

export default useMediaTrends;
