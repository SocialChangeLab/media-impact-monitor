"use client";
import { fadeVariants, scaleInVariants } from "@/utility/animationUtil";
import useQueryParams from "@/utility/useQueryParams";
import { scalePow } from "d3-scale";
import { addDays, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { Suspense, useMemo } from "react";
import seed from "seed-random";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import { config } from "./EventsTimeline";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";

const seededRandom = seed("loading-screen");
const randomUntil = (max: number) => Math.ceil(seededRandom() * max);

const sizeScale = scalePow(
	[0, 100],
	[config.eventMinHeight, config.eventMaxHeight],
);

function LoadingEventsTimelineWithoutSuspense() {
	const { searchParams } = useQueryParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const skeletons = useMemo(() => {
		const { from, to } = searchParams ?? {};
		const totalDays =
			!from || !to ? 25 : differenceInDays(addDays(to, 1), from);
		return Array(totalDays)
			.fill(null)
			.map((_, i) => ({
				colId: i,
				eventsWithSize: Array(randomUntil(11))
					.fill(null)
					.map((_, j) => ({
						eventId: j,
						height: `${Math.ceil(sizeScale(randomUntil(60)))}px`,
					})),
			}));
	}, [searchParams.from?.toISOString(), searchParams.to?.toISOString()]);

	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper
				animationKey="loading"
				columnsCount={skeletons.length + 1}
			>
				{skeletons.map(({ colId, eventsWithSize }) => (
					<motion.li
						key={`loading-event-col-${colId}`}
						className="grid grid-rows-subgrid row-span-3 relative animate-pulse"
						variants={fadeVariants}
						transition={{ staggerChildren: 0.01 }}
					>
						<div className="flex flex-col justify-end items-center gap-0.5">
							<div
								className="w-px h-full absolute top-0 left-1/2 -translate-x-1/2 bg-grayLight opacity-50"
								aria-hidden="true"
							/>
							{eventsWithSize.map(({ eventId, height }) => (
								<motion.div
									key={`loading-event-${eventId}`}
									className="size-3 relative z-10 bg-grayMed rounded-full "
									style={{
										height,
									}}
									variants={scaleInVariants}
								/>
							))}
						</div>
					</motion.li>
				))}
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	);
}

export default function LoadingEventsTimeline() {
	return (
		<Suspense>
			<LoadingEventsTimelineWithoutSuspense />
		</Suspense>
	);
}
