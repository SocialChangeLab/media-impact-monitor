'use client'
import { fadeVariants, scaleInVariants } from '@utility/animationUtil'
import { motion } from 'framer-motion'
import seed from 'seed-random'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import { impactScale } from './EventsTimeline'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'

const skeletons = Array(25)
	.fill(null)
	.map((_, i) => ({
		colId: i,
		fakeEvents: Array(Math.ceil(seed(`col-${i}`)() * 11))
			.fill(null)
			.map((_, j) => ({
				eventId: j,
				height: `${Math.ceil(impactScale(seed(`event-${j}`)() * 100))}px`,
			})),
	}))

export default function LoadingEventsTimeline() {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper animationKey="loading">
				{skeletons.map(({ colId, fakeEvents }) => (
					<motion.li
						key={`loading-event-col-${colId}`}
						className="flex flex-col gap-0.5 items-center justify-center"
						variants={fadeVariants}
					>
						{fakeEvents.map(({ eventId, height }) => (
							<motion.div
								key={`loading-event-${eventId}`}
								className="size-3 relative z-10 bg-grayMed rounded-full animate-pulse"
								style={{ height, animationDuration: `${1000 + colId * 100}ms` }}
								variants={scaleInVariants}
							/>
						))}
					</motion.li>
				))}
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	)
}
