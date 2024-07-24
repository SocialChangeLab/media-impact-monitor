"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useMemo } from "react";
import slugify from "slugify";
import { getMediaCoverageData } from "./mediaCoverageUtil";
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

function useMediaCoverageData() {
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
		"mediaCoverage",
		fromDateString,
		toDateString,
		organizersKey,
		mediaSource,
	];
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			await getMediaCoverageData(data.organisations || [], {
				from,
				to,
				organizers,
				mediaSource,
			}),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});

	useQueryErrorToast("event", query.error);

	return query;
}

export default useMediaCoverageData;
