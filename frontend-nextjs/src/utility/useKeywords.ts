"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useSuspenseQuery } from "@tanstack/react-query";
import { endOfDay, format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import { getMediaCoverageData } from "./mediaCoverageUtil";

function useMediaCoverageData() {
	const { from, to } = useFiltersStore(({ from, to }) => ({ from, to }));
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["mediaCoverage", fromDateString, toDateString];
	const query = useSuspenseQuery({
		queryKey,
		queryFn: async () => await getMediaCoverageData({ from, to }),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});

	useEffect(() => {
		if (!query.error) return;
		toast.error(`Error fetching media coverage data: ${query.error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [query.error]);

	return query;
}

export default useMediaCoverageData;
