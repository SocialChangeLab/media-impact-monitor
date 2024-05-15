"use client";

import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utility/classNames";
import useQueryParams from "@/utility/useQueryParams";
import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DatePickerWithRange({
	className,
	defaultDateRange,
	onChange = () => {},
	...calendarProps
}: CalendarProps & {
	className?: string;
	defaultDateRange?: DateRange;
	onChange?: (date: { from: Date; to: Date }) => void;
}) {
	const { setSearchParams } = useQueryParams();
	const [isOpen, setIsOpen] = useState(false);
	const lastRange = useRef<DateRange | undefined>();
	const [date, setDate] = useState<DateRange | undefined>(
		defaultDateRange || {
			from: new Date(2022, 0, 20),
			to: addDays(new Date(2022, 0, 20), 20),
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!defaultDateRange?.from || !defaultDateRange?.to) return;
		const currFrom = lastRange.current?.from?.toISOString();
		const currTo = lastRange.current?.to?.toISOString();
		const unchangedFrom = defaultDateRange.from.toISOString() === currFrom;
		const unchangedTo = defaultDateRange.to.toISOString() === currTo;
		if (unchangedFrom && unchangedTo) return;
		setDate(defaultDateRange);
	}, [
		defaultDateRange?.from?.toISOString(),
		defaultDateRange?.to?.toISOString(),
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!date?.from || !date?.to || isOpen) return;
		const currFrom = lastRange.current?.from;
		const currTo = lastRange.current?.to;
		const unchangedFrom = date.from.toISOString() === currFrom?.toISOString();
		const unchangedTo = date.to.toISOString() === currTo?.toISOString();
		if (unchangedFrom && unchangedTo) return;
		onChange({ from: date.from, to: date.to });
		lastRange.current = date;
	}, [isOpen, date?.from?.toISOString(), date?.to?.toISOString()]);

	return (
		<div className={cn(className)}>
			<Popover open={isOpen}>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn("font-normal", !date && "text-grayDark")}
						onClick={() => setIsOpen(true)}
					>
						<CalendarDays className="mr-2 w-6 h-6" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
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
							<Button
								onClick={() => {
									setIsOpen(false);
									if (!date?.from || !date?.to) return;
									setSearchParams({
										from: date?.from,
										to: date?.to,
									});
								}}
							>
								Apply
							</Button>
						</div>
					</PopoverContent>
				)}
			</Popover>
		</div>
	);
}
