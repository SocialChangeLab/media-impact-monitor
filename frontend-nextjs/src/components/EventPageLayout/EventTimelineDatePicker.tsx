"use client";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";

function EventTimelineDatePicker() {
	const { from, to, setDateRange } = useFiltersStore();

	return (
		<DatePickerWithRange
			defaultDateRange={{ from, to }}
			onChange={setDateRange}
		/>
	);
}

export default EventTimelineDatePicker;
