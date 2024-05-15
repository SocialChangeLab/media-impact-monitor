"use client";
import { fadeVariants, scaleInVariants } from "@/utility/animationUtil";
import useDays from "@/utility/useDays";
import useQueryParams from "@/utility/useQueryParams";
import { scalePow } from "d3-scale";
import { motion } from "framer-motion";
import { useMemo } from "react";
import seed from "seed-random";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import { config } from "./EventsTimeline";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineScrollWrapper from "./EventsTimelineScrollWrapper";

const seededRandom = seed("loading-screen");
const randomUntil = (max: number) => Math.ceil(seededRandom() * max);

const sizeScale = scalePow(
	[0, 100],
	[config.eventMinHeight, config.eventMaxHeight],
);

function LoadingEventsTimelineWithoutSuspense() {
	const { searchParams } = useQueryParams();
	const { from, to } = searchParams ?? {};
	const days = useDays({ from, to });

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
						<motion.li
							key={`loading-event-col-${colId}`}
							className="grid grid-rows-subgrid row-span-3 relative animate-pulse w-4 shrink-0 grow"
							variants={fadeVariants}
							transition={{ staggerChildren: 0.01 }}
						>
							<div className="flex flex-col justify-end items-center gap-0.5">
								{eventsWithSize.map(({ eventId, height }) => (
									<motion.div
										key={`loading-event-${eventId}`}
										className="size-3 relative z-10 bg-grayMed rounded-full "
										style={{ height }}
										variants={scaleInVariants}
									/>
								))}
							</div>
						</motion.li>
					))}
				</EventsTimelineChartWrapper>
				<EventsTimelineAxis
					eventDays={days.map((d) => ({ day: d, eventsWithSize: [] }))}
				/>
			</EventsTimelineScrollWrapper>
		</EventsTimelineWrapper>
	);
}

export default function LoadingEventsTimeline() {
	return <LoadingEventsTimelineWithoutSuspense />;
}
