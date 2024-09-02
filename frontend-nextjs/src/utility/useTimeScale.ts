import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { scaleUtc } from "d3-scale";
import { useMemo } from "react";

function useTimeScale(width: number) {
	const from = useFiltersStore(({ from }) => from);
	const to = useFiltersStore(({ to }) => to);
	return useMemo(
		() => scaleUtc().domain([from, to]).rangeRound([0, width]),
		[from, to, width],
	);
}

export default useTimeScale;
