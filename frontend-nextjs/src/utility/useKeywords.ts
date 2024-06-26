"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getMediaCoverageData } from "./mediaCoverageUtil";

function useMediaCoverageData() {
	const { from, to, organizers } = useFiltersStore(
		({ from, to, organizers }) => ({ from, to, organizers }),
	);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const organizersKey = useMemo(
		() => organizers.sort().join("-"),
		[organizers],
	);
	const queryKey = [
		"mediaCoverage",
		fromDateString,
		toDateString,
		organizersKey,
	];
	const query = useQuery({
		queryKey,
		queryFn: async () => await getMediaCoverageData({ from, to }),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});

	useEffect(() => {
		if (!query.error) return;
		toast.error(`Error fetching media coverage data: ${query.error}`, {
			important: true,
			dismissible: true,
			duration: 1000000,
		});
	}, [query.error]);

	return query;
}

export default useMediaCoverageData;
