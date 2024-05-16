"use client";

import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { defaultFrom, defaultTo } from "@/app/(events)/config";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utility/classNames";
import { CalendarDays } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function DatePickerWithRange({
	className,
	defaultDateRange,
	onChange = () => {},
}: CalendarProps & {
	className?: string;
	defaultDateRange: { from: Date; to: Date };
	onChange?: (date: { from: Date; to: Date }) => void;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const lastRange = useRef<DateRange | undefined>();
	const [date, setDate] = useState<DateRange | undefined>(defaultDateRange);
	const fromDateString = format(
		date?.from || new Date(defaultFrom),
		"yyyy-MM-dd",
	);
	const toDateString = format(date?.to || new Date(defaultTo), "yyyy-MM-dd");

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
									router.push(
										`${pathname}?from=${date.from.toISOString()}&to=${date.to.toISOString()}`,
										{ scroll: false },
									);
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
