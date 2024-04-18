import { fadeVariants, scaleInVariants } from '@/utility/animationUtil'
import { cn } from '@/utility/classNames'
import {
	EventType,
	OrganisationType,
	type EventsDataType,
} from '@/utility/eventsUtil'
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

export const impactScale = scalePow([0, 100], [12, 80])

function EventsTimeline({ events, organisations }: EventsDataType) {
	const { from, to, isPending } = useEvents()

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
				.sort((a, b) => a.organizations[0].localeCompare(b.organizations[0]))
			const eventsWithNegativeImpact = eventsOfTheDay
				.filter((evt) => evt.impact < 0)
				.sort((a, b) => b.organizations[0].localeCompare(a.organizations[0]))

			return {
				day: startOfDay(d),
				eventsWithPositiveImpact,
				eventsWithNegativeImpact,
			}
		})
	}, [events, timeDiffInDays, timeScale])

	if (events.length === 0) return <EmptyEventsTimeline />
	return (
		<EventsTimelineWrapper>
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
			{eventDays.length > 0 && (
				<div className="mt-6 flex flex-col gap-2">
					<h4 className="text-lg font-bold font-headlines antialiased relative">
						<span className="w-fit pr-4 bg-bg relative z-20">Legend</span>
						<span className="h-px w-full bg-grayLight absolute top-1/2 z-10"></span>
					</h4>
					<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8">
						{organisations.map((org) => (
							<li
								key={org.name}
								className="grid grid-cols-[auto_1fr_auto] gap-x-2 items-center border-b border-b-grayLight py-2"
							>
								<span
									className={cn(
										'size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark',
									)}
									style={{ backgroundColor: org.color }}
									aria-hidden="true"
								/>
								<span className="truncate">{org.name}</span>
								<span className="font-mono text-xs">{org.count}</span>
							</li>
						))}
					</ul>
				</div>
			)}
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
				className="size-3 relative z-10 hover:z-20"
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
