import { cn } from "@/utility/classNames";
import useTimeScale from "@/utility/useTimeScale";
import {
	type CountableTimeInterval,
	utcMonday,
	utcMonth,
	utcTicks,
	utcWeek,
} from "d3-time";
import {
	addDays,
	differenceInDays,
	differenceInMonths,
	differenceInWeeks,
	format,
	isSameDay,
} from "date-fns";
import { useMemo } from "react";
import { useComponentSize } from "react-use-size";

function EventsTimelineAxis({
	eventDays,
}: {
	eventDays: {
		day: Date;
	}[];
}) {
	const { width, ref } = useComponentSize();
	const timeScale = useTimeScale();

	const xAxisTicks = useMemo(() => {
		if (!timeScale) return [];
		const rangeStart = eventDays[0].day;
		const rangeEnd = addDays(eventDays[eventDays.length - 1].day, 1);
		const ticksCount = getOptimalTicks({ width, rangeStart, rangeEnd });
		const ticks = utcTicks(rangeStart, rangeEnd, ticksCount);
		const everyTwoTicks = ticks.filter((_, i) => i % 2 === 0);
		return ticks.length > ticksCount ? everyTwoTicks : ticks;
	}, [timeScale, width, eventDays]);

	if (eventDays.length === 0) return null;
	return (
		<div className="sticky bottom-0 w-full z-10">
			<ul
				ref={ref}
				aria-label="X Axis - Time"
				className={cn(
					"flex items-start pb-6 h-14 bg-pattern-soft",
					"relative justify-stretch overflow-clip",
				)}
				style={{ width: `max(${eventDays.length + 1}rem, 100%)` }}
			>
				{eventDays.map(({ day }) => {
					const shouldShowLabel = xAxisTicks.find((x) => isSameDay(x, day));
					return (
						<li
							key={day.toISOString()}
							className="flex min-w-4 bg-pattern-soft h-14 justify-center relative shrink-0 grow border-t border-grayMed"
							aria-label="X Axis Tick"
						>
							<span
								className={cn(
									"w-px h-2 absolute left-1/2 -translate-x-1/2 z-10",
									shouldShowLabel ? "bg-grayDark" : "bg-grayLight",
								)}
								aria-hidden="true"
							/>
							{shouldShowLabel && (
								<span className="absolute left-1/2 top-4 z-10 -translate-x-1/2 text-grayDark text-sm whitespace-nowrap">
									{format(new Date(day), "EEE dd.MM.yyyy")}
								</span>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function getOptimalTicks({
	width,
	rangeStart,
	rangeEnd,
}: {
	width?: number | undefined;
	rangeStart?: Date | undefined;
	rangeEnd?: Date | undefined;
} = {}): number {
	if (!width || !rangeStart || !rangeEnd) return 1;
	const widthOfALabel = 110;
	const amountOfFittingLabel = Math.floor(width / widthOfALabel) - 1;
	const toTicks = (timeInterval: CountableTimeInterval) => {
		const dateRangeLength = timeInterval.range(rangeStart, rangeEnd).length - 1;
		return Math.max(1, Math.min(dateRangeLength, amountOfFittingLabel));
	};

	if (differenceInMonths(rangeEnd, rangeStart) > 6) return toTicks(utcMonth);
	if (differenceInMonths(rangeEnd, rangeStart) > 3) return toTicks(utcWeek);
	if (differenceInWeeks(rangeEnd, rangeStart) > 3) return toTicks(utcMonday);
	return Math.max(
		1,
		Math.min(differenceInDays(rangeEnd, rangeStart), amountOfFittingLabel),
	);
}

export default EventsTimelineAxis;
