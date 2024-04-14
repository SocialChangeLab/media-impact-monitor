import { DatePickerWithRange } from '@components/ui/date-range-picker'
import { ReactNode } from 'react'

export default function EventPage({ children }: { children: ReactNode }) {
	return (
		<div className="px-6 pt-8 pb-16">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold font-headlines antialiased">
					{'Events'}
				</h1>
				<DatePickerWithRange />
			</div>
			<div className="flex flex-col gap-8">{children}</div>
		</div>
	)
}
