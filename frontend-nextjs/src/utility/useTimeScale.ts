import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { scaleUtc } from "d3-scale";
import { useMemo } from "react";

function useTimeScale() {
	const { from, to } = useFiltersStore();
	return useMemo(() => scaleUtc().domain([from, to]), [from, to]);
}

export default useTimeScale;
