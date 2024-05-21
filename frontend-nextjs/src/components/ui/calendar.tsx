"use client";

import type * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utility/classNames";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			captionLayout="dropdown-buttons"
			fromYear={2018}
			ISOWeek
			toYear={new Date().getFullYear()}
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption:
					'flex justify-between gap-2 pt-1 relative items-center [&_.rdp-vhidden]:hidden [&:has([name="previous-month"])]:flex-row-reverse',
				caption_label: "hidden text-sm font-medium",
				nav: "",
				nav_button: cn(buttonVariants({ variant: "outline", size: "icon" })),
				nav_button_previous: "",
				nav_button_next: "",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell: "text-grayDark rounded-md w-8 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-fg [&:has([aria-selected].day-outside)]:bg-bgOverlay [&:has([aria-selected].day-range-end)]:rounded-r-md",
					props.mode === "range"
						? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
						: "[&:has([aria-selected])]:rounded-md",
				),
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"h-8 w-8 p-0 font-normal aria-selected:opacity-100",
				),
				caption_dropdowns: "inline-flex w-fit items-center gap-4",
				day_range_start: "day-range-start",
				day_range_end: "day-range-end",
				day_selected:
					"bg-fg text-bg hover:bg-grayDark focus:bg-grayDark hover:text-bg focus:text-bg",
				day_today: "border border-fg text-fg font-bold",
				day_outside:
					"day-outside text-grayDark opacity-50 aria-selected:bg-grayLight aria-selected:text-grayDark aria-selected:opacity-30",
				day_disabled: "text-grayDark opacity-50",
				day_range_middle: "aria-selected:bg-grayLight aria-selected:text-fg",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
				IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,

				Dropdown: ({ ...props }) => {
					if (props.name === "months")
						return (
							<span>
								{format(new Date().setMonth(+String(props.value ?? 1)), "MMMM")}
							</span>
						);
					return (
						<select
							{...props}
							className={cn("w-fit border-0", props.className)}
						/>
					);
				},
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
