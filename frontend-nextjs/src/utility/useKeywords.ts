"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";
import {
	getMediaCoverageData,
	type MediaCoverageType,
} from "./mediaCoverageUtil";

function useMediaCoverageData(
	initialData?: Awaited<ReturnType<typeof getMediaCoverageData>>,
) {
	const { from, to } = useFiltersStore(({ from, to }) => ({ from, to }));
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["mediaCoverage", fromDateString, toDateString];
	const { data, isPending, error } = useQuery<MediaCoverageType[], Error>({
		queryKey,
		queryFn: async () => await getMediaCoverageData({ from, to }),
		initialData: initialData,
	});

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching media coverage data: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

	return {
		data,
		isPending,
		error: error,
	};
}

export default useMediaCoverageData;
