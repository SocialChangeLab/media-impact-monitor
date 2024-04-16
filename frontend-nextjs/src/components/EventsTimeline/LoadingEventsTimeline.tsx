'use client'
import { fadeVariants, scaleInVariants } from '@/utility/animationUtil'
import useQueryParams from '@/utility/useQueryParams'
import { addDays, differenceInDays } from 'date-fns'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import seed from 'seed-random'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import { impactScale } from './EventsTimeline'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'

const seededRandom = seed('loading-screen')
const randomUntil = (max: number) => Math.ceil(seededRandom() * max)

export default function LoadingEventsTimeline() {
	const { searchParams } = useQueryParams()

	const skeletons = useMemo(() => {
		const { from, to } = searchParams ?? {}
		const totalDays = !from || !to ? 25 : differenceInDays(addDays(to, 1), from)
		return Array(totalDays)
			.fill(null)
			.map((_, i) => ({
				colId: i,
				eventsWithPositiveImpact: Array(randomUntil(11))
					.fill(null)
					.map((_, j) => ({
						eventId: j,
						height: `${Math.ceil(impactScale(randomUntil(60)))}px`,
					})),
				eventsWithNegativeImpact: Array(randomUntil(4))
					.fill(null)
					.map((_, j) => ({
						eventId: j,
						height: `${Math.ceil(impactScale(randomUntil(20)))}px`,
					})),
			}))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams.from?.toISOString(), searchParams.to?.toISOString()])

	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper animationKey="loading">
				{skeletons.map(
					({ colId, eventsWithPositiveImpact, eventsWithNegativeImpact }) => (
						<motion.li
							key={`loading-event-col-${colId}`}
							className="grid grid-rows-subgrid row-span-3"
							variants={fadeVariants}
							transition={{ staggerChildren: 0.01 }}
						>
							<div className="flex flex-col justify-end items-center gap-0.5">
								{eventsWithPositiveImpact.map(({ eventId, height }) => (
									<motion.div
										key={`loading-event-${eventId}`}
										className="size-3 relative z-10 bg-grayMed rounded-full animate-pulse"
										style={{
											height,
											animationDuration: `${1000 + colId * 100}ms`,
										}}
										variants={scaleInVariants}
									/>
								))}
							</div>
							<span className="w-full bg-grayMed"></span>
							<div className="flex flex-col gap-0.5 items-center">
								{eventsWithNegativeImpact.map(({ eventId, height }) => (
									<motion.div
										key={`loading-event-${eventId}`}
										className="size-3 relative z-10 bg-grayMed rounded-full animate-pulse"
										style={{
											height,
											animationDuration: `${1000 + colId * 100}ms`,
										}}
										variants={scaleInVariants}
									/>
								))}
							</div>
						</motion.li>
					),
				)}
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	)
}
