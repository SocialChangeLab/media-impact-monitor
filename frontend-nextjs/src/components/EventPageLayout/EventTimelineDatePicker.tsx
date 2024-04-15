'use client'
import { DatePickerWithRange } from '@components/ui/date-range-picker'
import useEvents from '@utility/useEvents'

function EventTimelineDatePicker() {
	const { from, to, setDateRange } = useEvents()
	return (
		<DatePickerWithRange
			defaultDateRange={{ from, to }}
			onChange={setDateRange}
		/>
	)
}

export default EventTimelineDatePicker
