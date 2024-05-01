'use client'
import { fadeVariants, scaleInVariants } from '@/utility/animationUtil'
import { cn } from '@/utility/classNames'
import { slugifyCssClass } from '@/utility/cssSlugify'
import { EventType, OrganisationType } from '@/utility/eventsUtil'
import useEvents from '@/utility/useEvents'
import useTimeScale from '@/utility/useTimeScale'
import { scalePow } from 'd3-scale'
import { addDays, differenceInDays, isSameDay, startOfDay } from 'date-fns'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import EmptyEventsTimeline from './EmptyEventsTimeline'
import EventBubbleLink from './EventBubbleLink'
import EventTooltip from './EventTooltip'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import EventsTimelineAxis from './EventsTimelineAxis'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'
import EventsTimelineLegend from './EventsTimelineLegend'

export const impactScale = scalePow([0, 100], [12, 80])

function EventsTimeline() {
	const { from, to, isPending, data } = useEvents()
	const { events, organisations } = data

	const timeScale = useTimeScale()

	const timeDiffInDays = useMemo(
		() => Math.abs(differenceInDays(addDays(to, 1), from)),
		[from, to],
	)

	const eventDays = useMemo(() => {
		if (!timeScale) return []
		return (timeScale.ticks(timeDiffInDays) ?? []).map((d) => {
			const eventsOfTheDay = events.filter((evt) => isSameDay(evt.date, d))
			const eventsWithPositiveImpact = eventsOfTheDay
				.filter((evt) => evt.impact >= 0)
				.sort((a, b) => a.organizers[0]?.localeCompare(b.organizers[0]))
			const eventsWithNegativeImpact = eventsOfTheDay
				.filter((evt) => evt.impact < 0)
				.sort((a, b) => b.organizers[0]?.localeCompare(a.organizers[0]))

			return {
				day: startOfDay(d),
				eventsWithPositiveImpact,
				eventsWithNegativeImpact,
			}
		})
	}, [events, timeDiffInDays, timeScale])

	if (events.length === 0) return <EmptyEventsTimeline />
	return (
		<EventsTimelineWrapper organisations={organisations}>
			<EventsTimelineChartWrapper
				animationKey={[
					from?.toISOString(),
					to?.toISOString(),
					isPending.toString(),
				].join('-')}
				columnsCount={timeDiffInDays + 1}
			>
				{eventDays.map(
					({ day, eventsWithNegativeImpact, eventsWithPositiveImpact }) => (
						<motion.li
							key={`event-day-${day.toISOString()}`}
							className="grid grid-rows-subgrid row-span-3 relative"
							variants={fadeVariants}
							transition={{ staggerChildren: 0.01 }}
						>
							<div className="flex flex-col justify-end items-center gap-0.5">
								<div
									className="w-px h-full absolute top-0 left-1/2 -translate-x-1/2 bg-grayLight opacity-50"
									aria-hidden="true"
								/>
								{eventsWithPositiveImpact.map((event) => (
									<EventTimelineItem
										key={event.event_id}
										event={event}
										organisations={organisations}
									/>
								))}
							</div>
							<span className="bg-grayMed"></span>
							<div className="flex flex-col gap-0.5 items-center">
								{eventsWithNegativeImpact.map((event) => (
									<EventTimelineItem
										key={event.event_id}
										event={event}
										organisations={organisations}
									/>
								))}
							</div>
						</motion.li>
					),
				)}
			</EventsTimelineChartWrapper>
			<EventsTimelineAxis eventDays={eventDays} />
			<EventsTimelineLegend />
		</EventsTimelineWrapper>
	)
}

type EventTimelineItemProps = {
	event: EventType
	organisations: OrganisationType[]
}
function EventTimelineItem({ event, organisations }: EventTimelineItemProps) {
	return (
		<EventTooltip
			key={event.event_id}
			event={event}
			organisations={organisations}
		>
			<motion.div
				className={cn(
					'size-3 relative z-10 hover:z-20',
					'event-item transition-opacity',
					event.organizers.map(
						(org) =>
							`event-item-org-${slugifyCssClass(org) || 'unknown-organisation'}`,
					),
				)}
				style={{
					height: `${Math.ceil(impactScale(Math.abs(event.impact)))}px`,
				}}
				variants={scaleInVariants}
			>
				<EventBubbleLink event={event} organisations={organisations} />
			</motion.div>
		</EventTooltip>
	)
}

export default EventsTimeline
