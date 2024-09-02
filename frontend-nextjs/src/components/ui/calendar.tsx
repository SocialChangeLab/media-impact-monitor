'use client'

import type * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import { useToday } from '@/providers/TodayProvider'
import { cn } from '@/utility/classNames'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	const { today } = useToday()
	return (
		<DayPicker
			captionLayout="dropdown-buttons"
			fromYear={2020}
			ISOWeek
			toYear={today.getFullYear()}
			showOutsideDays={showOutsideDays}
			className={cn('px-3 ', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month:
					'space-y-4 first:border-r first:pr-4 border-grayUltraLight pt-1 pb-3',
				caption:
					'flex justify-between gap-2 pt-1 relative items-center [&_.rdp-vhidden]:hidden [&:has([name="previous-month"])]:flex-row-reverse',
				caption_label: 'hidden text-sm font-medium',
				nav: '',
				nav_button: cn(buttonVariants({ variant: 'outline', size: 'icon' })),
				nav_button_previous: '',
				nav_button_next: '',
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex justify-stretch',
				head_cell: 'text-grayDark rounded-md w-full font-normal text-[0.8rem]',
				row: 'flex w-full mt-2 justify-stretch',
				cell: cn(
					'relative p-0 text-center w-full text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-grayLight [&:has([aria-selected].day-outside)]:bg-grayUltraLight',
				),
				day: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-10 w-full p-0 font-normal aria-selected:opacity-100',
				),
				caption_dropdowns: 'inline-flex w-fit items-center gap-2',
				day_range_start: 'day-range-start',
				day_range_end: 'day-range-end',
				day_selected:
					'bg-fg text-bg hover:bg-grayDark focus:bg-grayDark hover:text-bg focus:text-bg',
				day_today:
					'!font-bold !bg-grayLight !text-fg !border-bg !rounded-full !border-2',
				day_outside:
					'day-outside text-grayDark opacity-50 aria-selected:bg-grayLight aria-selected:text-grayDark aria-selected:opacity-30',
				day_disabled: 'text-grayDark opacity-50',
				day_range_middle: 'aria-selected:bg-grayLight aria-selected:text-fg',
				day_hidden: 'invisible',
				...classNames,
			}}
			components={{
				IconLeft: () => <ChevronLeft className="h-4 w-4" />,
				IconRight: () => <ChevronRight className="h-4 w-4" />,

				Dropdown: ({ ...props }) => {
					return (
						<select
							{...props}
							className={cn(
								'w-fit mix-blend-darken dark:mix-blend-lighten border-0',
								props.className,
							)}
						/>
					)
				},
			}}
			{...props}
		/>
	)
}
Calendar.displayName = 'Calendar'

export { Calendar }
