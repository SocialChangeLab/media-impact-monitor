"use client";
import { useToday } from "@/providers/TodayProvider";
import {
	type ComparableDateItemType,
	dateToComparableDateItem,
} from "@/utility/comparableDateItemSchema";
import { randomUntil } from "@/utility/randomUtil";
import useElementSize from "@custom-react-hooks/use-element-size";
import { scalePow } from "d3-scale";
import { addDays } from "date-fns";
import { memo, useMemo } from "react";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineLegend from "./EventsTimelineLegend";
import EventsTimelineScrollWrapper from "./EventsTimelineScrollWrapper";
import config from "./eventsTimelineConfig";

const sizeScale = scalePow(
	[0, 100],
	[config.eventMinHeight, config.eventMaxHeight],
);

const LoadingEventsTimeline = memo(() => {
	const [parentRef, size] = useElementSize();
	const { today } = useToday();
	const startDate = new Date("2023-01-01T00:00:00.000Z");
	const intervals = Array.from({ length: 30 }, (_, idx) => idx + 1).reduce(
		(acc, idx) =>
			acc.concat(dateToComparableDateItem(addDays(startDate, idx), today)),
		[] as ComparableDateItemType[],
	);

	const skeletons = useMemo(() => {
		return intervals.map((_, i) => ({
			colId: i,
			eventsWithSize: Array(randomUntil(6, `${i * Math.PI}`))
				.fill(null)
				.map((_, j) => ({
					eventId: j,
					height: `${Math.ceil(
						sizeScale(randomUntil(40, `${i * Math.PI}-${j * Math.PI}`)),
					)}px`,
				})),
		}));
	}, [intervals]);

	return (
		<EventsTimelineWrapper ref={parentRef}>
			<EventsTimelineScrollWrapper>
				<EventsTimelineChartWrapper columnsCount={skeletons.length + 1}>
					{skeletons.map(({ colId, eventsWithSize }) => (
						<li
							key={`loading-event-col-${colId}`}
							className="grid grid-rows-subgrid row-span-3 relative animate-pulse py-4 w-4 shrink-0 grow"
						>
							<div className="flex flex-col justify-end items-center gap-0.5">
								{eventsWithSize.map(({ eventId, height }) => (
									<div
										key={`loading-event-${eventId}`}
										className="size-3 relative z-10 bg-grayMed rounded-full "
										style={{ height }}
									/>
								))}
							</div>
						</li>
					))}
				</EventsTimelineChartWrapper>
				<EventsTimelineAxis
					eventColumns={intervals.map((d) => ({ ...d, eventsWithSize: [] }))}
					aggregationUnit="day"
					width={size.width}
				/>
			</EventsTimelineScrollWrapper>
			<EventsTimelineLegend />
		</EventsTimelineWrapper>
	);
});

export default LoadingEventsTimeline;
