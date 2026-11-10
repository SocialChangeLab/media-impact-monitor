'use client'

import type * as React from 'react'
import { DayPicker } from '@daypicker/react'

import { buttonVariants } from '@/components/ui/button'
import { useToday } from '@/providers/TodayProvider'
import { cn } from '@/utility/classNames'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'

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
			captionLayout="dropdown"
			navLayout="around"
			startMonth={new Date(2020, 0)}
			ISOWeek
			endMonth={new Date(today.getFullYear(), 11)}
			showOutsideDays={showOutsideDays}
			className={cn('px-3 ', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month:
					'relative first:border-r first:pr-4 border-grayUltraLight pt-1 pb-3',
				month_caption:
					'flex justify-center gap-2 min-h-10 px-10 relative items-center',
				caption_label: 'hidden text-sm font-medium',
				nav: '',
				button_previous: cn(
					buttonVariants({ variant: 'outline', size: 'icon' }),
					'absolute left-0 top-1 aria-disabled:opacity-50',
				),
				button_next: cn(
					buttonVariants({ variant: 'outline', size: 'icon' }),
					'absolute right-0 top-1 aria-disabled:opacity-50',
				),
				month_grid: 'mt-4 w-full border-collapse space-y-1',
				weekdays: 'flex justify-stretch',
				weekday: 'text-grayDark rounded-md w-full font-normal text-[0.8rem]',
				week: 'flex w-full mt-2 justify-stretch',
				day: cn(
					'relative p-0 text-center w-full text-sm focus-within:relative focus-within:z-20 aria-selected:bg-grayLight [&.day-outside[aria-selected]]:bg-grayUltraLight',
				),
				day_button: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-10 w-full p-0 font-normal aria-selected:opacity-100',
				),
				dropdowns: 'inline-flex w-fit items-center gap-2',
				range_start: 'day-range-start',
				range_end: 'day-range-end',
				selected:
					'[&:not(.day-range-middle):not(.day-outside)>button]:bg-fg [&:not(.day-range-middle):not(.day-outside)>button]:text-bg [&:not(.day-range-middle)>button:hover]:bg-grayDark [&:not(.day-range-middle)>button:focus]:bg-grayDark [&:not(.day-range-middle)>button:hover]:text-bg [&:not(.day-range-middle)>button:focus]:text-bg',
				today:
					'[&>button]:!font-bold [&>button]:!bg-grayLight [&>button]:!text-fg [&>button]:!border-bg [&>button]:!rounded-full [&>button]:!border-2',
				outside:
					'day-outside text-grayDark opacity-50 [&[aria-selected]>button]:bg-grayLight [&[aria-selected]>button]:text-grayDark aria-selected:opacity-30',
				disabled: '[&>button]:text-grayDark [&>button]:opacity-50',
				range_middle: 'day-range-middle [&[aria-selected]>button]:bg-grayLight [&[aria-selected]>button]:text-fg',
				hidden: 'invisible',
				...classNames,
			}}
			components={{
				Chevron: ({ orientation, className, style }) => {
					const icons = {
						left: ChevronLeft,
						right: ChevronRight,
						up: ChevronUp,
						down: ChevronDown,
					}
					const Icon = icons[orientation ?? 'down']
					return <Icon className={cn('h-4 w-4', className)} style={style} />
				},

				Select: ({ ...props }) => {
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
