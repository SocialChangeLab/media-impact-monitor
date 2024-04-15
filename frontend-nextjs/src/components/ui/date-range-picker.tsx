'use client'

import { addDays, format } from 'date-fns'
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
import { useEffect, useState } from 'react'

export function DatePickerWithRange({
	className,
	defaultDateRange,
	onChange = () => {},
}: {
	className?: string
	defaultDateRange?: DateRange
	onChange?: (date: { from: Date; to: Date }) => void
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [date, setDate] = useState<DateRange | undefined>(
		defaultDateRange || {
			from: new Date(2022, 0, 20),
			to: addDays(new Date(2022, 0, 20), 20),
		},
	)

	useEffect(() => {
		if (!defaultDateRange?.from || !defaultDateRange?.to) return
		setDate(defaultDateRange)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		defaultDateRange?.from?.toISOString(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		defaultDateRange?.to?.toISOString(),
	])

	useEffect(() => {
		if (!date?.from || !date?.to || isOpen) return
		onChange({ from: date.from, to: date.to })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, date?.from?.toISOString(), date?.to?.toISOString()])

	return (
		<div className={cn(className)}>
			<Popover open={isOpen}>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn('font-normal', !date && 'text-grayDark')}
						onClick={() => setIsOpen(true)}
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
				{isOpen && (
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
							<Button onClick={() => setIsOpen(false)}>Apply</Button>
						</div>
					</PopoverContent>
				)}
			</Popover>
		</div>
	)
}
