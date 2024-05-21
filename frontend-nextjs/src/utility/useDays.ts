import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { addDays, differenceInDays, startOfDay } from "date-fns";
import { useMemo } from "react";

function useDays() {
	const { from, to } = useFiltersStore();

	const eventDays = useMemo(() => {
		if (!from || !to) return [];
		const diffInDays = Math.abs(differenceInDays(to, from)) + 1;
		return new Array(diffInDays).fill(null).map((_, idx) => {
			const day = startOfDay(addDays(from, idx));
			return day;
		});
	}, [from, to]);
	return eventDays;
}

export default useDays;
