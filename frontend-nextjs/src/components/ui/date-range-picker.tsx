"use client";

import { format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utility/classNames";
import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function DatePickerWithRange({
	className,
	defaultDateRange,
	dateRange,
	onChange = () => {},
	onReset,
}: CalendarProps & {
	className?: string;
	defaultDateRange: { from: Date; to: Date };
	dateRange: { from: Date; to: Date };
	onChange?: (date: { from: Date; to: Date }) => void;
	onReset?: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const lastRange = useRef<DateRange | undefined>();
	const [date, setDate] = useState<DateRange | undefined>(dateRange);
	const fromDateString = format(date?.from || new Date(), "yyyy-MM-dd");
	const toDateString = format(date?.to || new Date(), "yyyy-MM-dd");

	const isDefault = useMemo(() => {
		if (!defaultDateRange.from || !defaultDateRange.to) return false;
		if (!date?.from || !date?.to) return false;
		return (
			isSameDay(defaultDateRange.from, date.from) &&
			isSameDay(defaultDateRange.to, date.to)
		);
	}, [defaultDateRange.from, defaultDateRange.to, date?.from, date?.to]);

	useEffect(() => {
		if (!dateRange.from || !dateRange.to) return;
		setDate(dateRange);
	}, [dateRange]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!date?.from || !date?.to || isOpen) return;
		if (!lastRange.current?.from || !lastRange.current?.to) return;
		const currFrom = format(lastRange.current.from, "yyyy-MM-dd");
		const currTo = format(lastRange.current.to, "yyyy-MM-dd");
		const unchangedFrom = fromDateString === currFrom;
		const unchangedTo = toDateString === currTo;
		if (unchangedFrom && unchangedTo) return;
		onChange({ from: date.from, to: date.to });
		lastRange.current = date;
	}, [isOpen, fromDateString, toDateString]);

	return (
		<div className={cn(className)}>
			<Popover
				open={isOpen}
				onOpenChange={(newOpen) => {
					setIsOpen(newOpen);
					if (isOpen && !newOpen) {
						setDate(lastRange.current || dateRange);
					}
				}}
			>
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
							disabled={{ after: new Date() }}
						/>
						<div className="p-3 flex justify-end gap-4">
							{onReset && !isDefault && (
								<Button
									variant="ghost"
									onClick={() => {
										setIsOpen(false);
										onReset();
									}}
								>
									Reset defaults
								</Button>
							)}
							<Button
								variant="outline"
								onClick={() => {
									setIsOpen(false);
									setDate(lastRange.current || dateRange);
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									setIsOpen(false);
									if (!date?.from || !date?.to) return;
									onChange({ from: date.from, to: date.to });
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
