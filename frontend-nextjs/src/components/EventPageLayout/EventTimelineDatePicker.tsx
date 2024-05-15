"use client";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import useEvents from "@/utility/useEvents";

function EventTimelineDatePicker() {
	const { from, to, setDateRange } = useEvents();
	return (
		<DatePickerWithRange
			defaultDateRange={{ from, to }}
			onChange={setDateRange}
			toDate={new Date()}
			fromDate={new Date("01/01/2020")}
		/>
	);
}

export default EventTimelineDatePicker;
