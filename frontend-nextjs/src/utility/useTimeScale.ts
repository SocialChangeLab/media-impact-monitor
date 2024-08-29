import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { scaleUtc } from "d3-scale";
import { useMemo } from "react";

function useTimeScale(width: number) {
	const range = useFiltersStore(({ from, to }) => ({ from, to }));
	return useMemo(
		() => scaleUtc().domain([range.from, range.to]).rangeRound([0, width]),
		[range, width],
	);
}

export default useTimeScale;
