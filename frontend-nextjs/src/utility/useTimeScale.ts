import { scaleUtc } from "d3-scale";
import { addDays } from "date-fns";
import { useMemo } from "react";
import useEvents from "./useEvents";

function useTimeScale() {
	const { from, to } = useEvents();

	return useMemo(() => scaleUtc().domain([from, addDays(to, 1)]), [from, to]);
}

export default useTimeScale;
