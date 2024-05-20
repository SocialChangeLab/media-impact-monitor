"use client";
import useDays from "@/utility/useDays";
import { scalePow } from "d3-scale";
import { useMemo } from "react";
import seed from "seed-random";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineScrollWrapper from "./EventsTimelineScrollWrapper";
import config from "./eventsTimelineConfig";

const seededRandom = seed("loading-screen");
const randomUntil = (max: number) => Math.ceil(seededRandom() * max);

const sizeScale = scalePow(
	[0, 100],
	[config.eventMinHeight, config.eventMaxHeight],
);

export default function LoadingEventsTimeline() {
	const days = useDays();

	const skeletons = useMemo(() => {
		return days.map((_, i) => ({
			colId: i,
			eventsWithSize: Array(randomUntil(11))
				.fill(null)
				.map((_, j) => ({
					eventId: j,
					height: `${Math.ceil(sizeScale(randomUntil(60)))}px`,
				})),
		}));
	}, [days]);

	return (
		<EventsTimelineWrapper>
			<EventsTimelineScrollWrapper animationKey="loading-parent">
				<EventsTimelineChartWrapper
					animationKey="loading"
					columnsCount={skeletons.length + 1}
				>
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
					eventDays={days.map((d) => ({ day: d, eventsWithSize: [] }))}
				/>
			</EventsTimelineScrollWrapper>
		</EventsTimelineWrapper>
	);
}
