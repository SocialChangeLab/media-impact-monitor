"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { DatePickerWithRange } from "./ui/date-range-picker";

function TimeFilter() {
	const { from, to, defaultFrom, defaultTo, setDateRange, resetDateRange } =
		useFiltersStore((state) => state);
	return (
		<DatePickerWithRange
			defaultDateRange={{ from: defaultFrom, to: defaultTo }}
			dateRange={{ from, to }}
			onChange={setDateRange}
			onReset={resetDateRange}
		/>
	);
}

export default TimeFilter;
