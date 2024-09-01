'use client'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { DatePickerWithRange } from './ui/date-range-picker'

function TimeFilter() {
	const from = useFiltersStore(({ from }) => from)
	const to = useFiltersStore(({ to }) => to)
	const defaultFrom = useFiltersStore(({ defaultFrom }) => defaultFrom)
	const defaultTo = useFiltersStore(({ defaultTo }) => defaultTo)
	const setDateRange = useFiltersStore(({ setDateRange }) => setDateRange)
	const resetDateRange = useFiltersStore(({ resetDateRange }) => resetDateRange)
	return (
		<DatePickerWithRange
			defaultDateRange={{ from: defaultFrom, to: defaultTo }}
			dateRange={{ from, to }}
			onChange={setDateRange}
			onReset={resetDateRange}
		/>
	)
}

export default TimeFilter
