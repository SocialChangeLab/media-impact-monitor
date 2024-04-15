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
	const [isOpen, setIsOpen] = React.useState(false)
	const [date, setDate] = React.useState<DateRange | undefined>(
		defaultDateRange || {
			from: new Date(2022, 0, 20),
			to: addDays(new Date(2022, 0, 20), 20),
		},
	)

	return (
		<div className={cn(className)}>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn('font-normal', !date && 'text-grayDark')}
					>
						<CalendarDays className="mr-2 w-6 h-6" />
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
						onSelect={setDate}
						numberOfMonths={2}
					/>
					<div className="p-3 flex justify-end">
						<Button
							onClick={() => {
								setIsOpen(false)
								date && onChange(date)
							}}
						>
							Apply
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
