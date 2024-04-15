'use client'
import { DatePickerWithRange } from '@components/ui/date-range-picker'
import useQueryParams from '@utility/useQueryParams'
import { PropsWithChildren } from 'react'

function EventPageLayout({ children }: PropsWithChildren<{}>) {
	const { searchParams, setSearchParams } = useQueryParams()

	return (
		<div className="px-6 pt-8 pb-16">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold font-headlines antialiased">
					{'Events'}
				</h1>
				<DatePickerWithRange
					defaultDateRange={{
						from: searchParams.from ?? undefined,
						to: searchParams.to ?? undefined,
					}}
					onChange={({ from, to }) => {
						if (!from || !to) return
						setSearchParams({ from, to })
					}}
				/>
			</div>
			<div className="flex flex-col gap-8">{children}</div>
		</div>
	)
}

export default EventPageLayout
