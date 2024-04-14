'use client'

import { addDays, format } from 'date-fns'
import * as React from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@utility/classNames'
import { CalendarDays } from 'lucide-react'

export function DatePickerWithRange({
	className,
	defaultDateRange,
	onChange = () => {},
}: {
	className?: string
	defaultDateRange?: DateRange
	onChange?: (date: DateRange) => void
}) {
	const [date, setDate] = React.useState<DateRange | undefined>(
		defaultDateRange || {
			from: new Date(2022, 0, 20),
			to: addDays(new Date(2022, 0, 20), 20),
		},
	)

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-grayDark',
						)}
					>
						<CalendarDays className="mr-2" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} -{' '}
									{format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="end">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={(range) => {
							setDate(range)
							if (!range) return
							onChange(range)
						}}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
