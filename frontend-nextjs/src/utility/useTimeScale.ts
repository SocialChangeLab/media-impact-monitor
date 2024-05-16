import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { scaleUtc } from "d3-scale";
import { addDays } from "date-fns";
import { useMemo } from "react";

function useTimeScale() {
	const { from, to } = useFiltersStore();
	return useMemo(() => scaleUtc().domain([from, addDays(to, 1)]), [from, to]);
}

export default useTimeScale;
