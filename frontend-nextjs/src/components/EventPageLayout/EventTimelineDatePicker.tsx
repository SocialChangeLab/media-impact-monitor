"use client";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";

function EventTimelineDatePicker() {
	const { from, to, defaultFrom, defaultTo, setDateRange, resetDateRange } =
		useFiltersStore((store) => store);

	return (
		<DatePickerWithRange
			defaultDateRange={{ from: defaultFrom, to: defaultTo }}
			dateRange={{ from, to }}
			onChange={setDateRange}
			onReset={resetDateRange}
		/>
	);
}

export default EventTimelineDatePicker;
