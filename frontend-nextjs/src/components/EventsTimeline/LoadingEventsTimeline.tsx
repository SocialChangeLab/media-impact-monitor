'use client'
import { motion } from 'framer-motion'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import { impactScale } from './EventsTimeline'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'

const skeletons = Array(25)
	.fill(null)
	.map((_, i) => ({
		colId: i,
		fakeEvents: Array(Math.ceil(Math.random() * 20))
			.fill(null)
			.map((_, j) => ({
				eventId: j,
				height: `${Math.ceil(impactScale(Math.random()))}px`,
			})),
	}))

export default function LoadingEventsTimeline() {
	return (
		<EventsTimelineWrapper>
			<EventsTimelineChartWrapper>
				{skeletons.map(({ colId, fakeEvents }) => (
					<motion.li
						key={`loading-event-col-${colId}`}
						className="flex flex-col gap-0.5 items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.2 }}
					>
						{fakeEvents.map(({ eventId, height }) => (
							<div
								key={`loading-event-${eventId}`}
								className="size-3 relative z-10 bg-grayMed rounded-full opacity-10 animate-pulse"
								style={{ height, animationDuration: `${1000 + colId * 100}ms` }}
							/>
						))}
					</motion.li>
				))}
			</EventsTimelineChartWrapper>
		</EventsTimelineWrapper>
	)
}
