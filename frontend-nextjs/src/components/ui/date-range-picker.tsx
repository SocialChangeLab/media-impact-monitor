"use client";

import { endOfDay, isSameDay, startOfDay, subDays, subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useToday } from "@/providers/TodayProvider";
import { cn } from "@/utility/classNames";
import { format } from "@/utility/dateUtil";
import { CalendarDays } from "lucide-react";
import {
	type ReactNode,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export const DatePickerWithRange = memo(
	({
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
	}) => {
		const [isOpen, setIsOpen] = useState(false);
		const lastRange = useRef<DateRange | undefined>();
		const [date, setDate] = useState<DateRange | undefined>(dateRange);
		const [month, setMonth] = useState<Date | undefined>();
		const { today } = useToday();
		const fromDateString = format(date?.from || today, "yyyy-MM-dd");
		const toDateString = format(date?.to || today, "yyyy-MM-dd");

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

		const onRangeChange = useCallback(
			(newRange?: DateRange) => {
				setIsOpen(false);
				const { from, to } = newRange || {};
				if (!from || !to) return;
				onChange({ from, to });
			},
			[onChange],
		);

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
							className={cn(
								"font-normal max-lg:px-2 max-lg:py-1",
								!date && "text-grayDark",
							)}
							onClick={() => setIsOpen(true)}
						>
							<CalendarDays className="lg:mr-2 size-5 md:size-6" />
							<span className="hidden md:block text-sm lg:text-base">
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
							</span>
						</Button>
					</PopoverTrigger>
					{isOpen && (
						<PopoverContent
							className="w-auto max-w-[calc(100vw-(2*var(--pagePadding)))] p-0 z-[70]"
							align="end"
						>
							<div className="flex gap-4 p-3 border-b border-grayUltraLight items-center justify-end">
								<span className="grow">Presets:</span>
								<LastTwelveMonthButton
									currentRange={date}
									onChange={(range) => {
										setMonth(range.from);
										setDate(range);
									}}
								/>
								<LastSixMonthButton
									currentRange={date}
									onChange={(range) => {
										setMonth(range.from);
										setDate(range);
									}}
								/>
								<LastMonthButton
									currentRange={date}
									onChange={(range) => {
										setMonth(range.from);
										setDate(range);
									}}
								/>
							</div>
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={date?.from}
								selected={date}
								onSelect={setDate}
								numberOfMonths={2}
								disabled={{ after: subDays(endOfDay(today), 1) }}
								month={month}
								onMonthChange={setMonth}
							/>
							<div className="p-3 flex justify-end gap-4 border-t border-grayUltraLight">
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
									onClick={() => onRangeChange(lastRange.current || dateRange)}
								>
									Cancel
								</Button>
								<Button onClick={() => onRangeChange(date)}>Apply</Button>
							</div>
						</PopoverContent>
					)}
				</Popover>
			</div>
		);
	},
);

const LastSixMonthButton = memo(
	({
		onChange,
		currentRange,
	}: {
		onChange: (range: DateRange) => void;
		currentRange?: DateRange;
	}) => {
		const { today } = useToday();
		return (
			<PresetButton
				currentRange={currentRange}
				targetRange={{
					from: startOfDay(subMonths(startOfDay(subDays(today, 1)), 6)),
					to: endOfDay(subDays(today, 1)),
				}}
				onChange={onChange}
			>
				<span className="hidden md:inline">Last 6 months</span>
				<span className="inline md:hidden">-6M</span>
			</PresetButton>
		);
	},
);

const LastTwelveMonthButton = memo(
	({
		onChange,
		currentRange,
	}: {
		onChange: (range: DateRange) => void;
		currentRange?: DateRange;
	}) => {
		const { today } = useToday();
		return (
			<PresetButton
				currentRange={currentRange}
				targetRange={{
					from: startOfDay(subMonths(startOfDay(subDays(today, 1)), 12)),
					to: endOfDay(subDays(today, 1)),
				}}
				onChange={onChange}
			>
				<span className="hidden md:inline">Last 12 months</span>
				<span className="inline md:hidden">-12M</span>
			</PresetButton>
		);
	},
);

const LastMonthButton = memo(
	({
		onChange,
		currentRange,
	}: {
		onChange: (range: DateRange) => void;
		currentRange?: DateRange;
	}) => {
		const { today } = useToday();
		return (
			<PresetButton
				currentRange={currentRange}
				targetRange={{
					from: startOfDay(subDays(today, 31)),
					to: endOfDay(subDays(today, 1)),
				}}
				onChange={onChange}
			>
				<span className="hidden md:inline">Last 30 days</span>
				<span className="inline md:hidden">-30D</span>
			</PresetButton>
		);
	},
);

const PresetButton = memo(
	({
		onChange,
		currentRange,
		targetRange,
		children,
	}: {
		onChange: (range: DateRange) => void;
		currentRange?: DateRange;
		targetRange: { from: Date; to: Date };
		children: ReactNode;
	}) => {
		const isActive =
			currentRange?.from &&
			currentRange?.to &&
			isSameDay(currentRange.from, targetRange.from) &&
			isSameDay(currentRange.to, targetRange.to);
		return (
			<Button
				variant={isActive ? "default" : "outline"}
				onClick={() => onChange(targetRange)}
			>
				{children}
			</Button>
		);
	},
);
