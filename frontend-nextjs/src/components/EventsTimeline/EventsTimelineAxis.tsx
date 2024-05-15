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
		const [rangeStart, rangeEnd] = timeScale.domain();
		const ticksCount = getOptimalTicks({ width, rangeStart, rangeEnd });
		const ticks = utcTicks(rangeStart, rangeEnd, ticksCount);
		const everyTwoTicks = ticks.filter((_, i) => i % 2 === 0);
		return ticks.length > ticksCount ? everyTwoTicks : ticks;
	}, [timeScale, width]);

	if (eventDays.length === 0) return null;
	return (
		<ul
			ref={ref}
			aria-label="X Axis - Time"
			className={cn(
				"flex items-center pb-6 justify-stretch",
				"min-w-full border-t border-grayMed px-2",
			)}
		>
			<li aria-hidden="true" className="flex w-full min-h-px justify-center">
				<span className="absolute left-1/2 -translate-x-1/2 w-px h-2" />
			</li>
			{eventDays.map(({ day }) => {
				const shouldShowLabel = xAxisTicks.find((x) => isSameDay(x, day));
				return (
					<li
						key={day.toISOString()}
						className="flex w-full min-h-px justify-center relative"
						aria-label="X Axis Tick"
					>
						<span
							className={cn(
								"w-px h-2 absolute left-1/2 -translate-x-1/2",
								shouldShowLabel ? "bg-grayMed" : "bg-grayLight",
							)}
							aria-hidden="true"
						/>
						{shouldShowLabel && (
							<span className="absolute left-1/2 top-4 -translate-x-1/2 text-grayDark text-sm whitespace-nowrap">
								{format(new Date(day), "EEE dd.MM.yyyy")}
							</span>
						)}
					</li>
				);
			})}
		</ul>
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
