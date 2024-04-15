import { fadeVariants, scaleInVariants } from '@utility/animationUtil'
import { cn } from '@utility/classNames'
import { type EventsDataType } from '@utility/eventsUtil'
import useEvents from '@utility/useEvents'
import { scalePow, scaleUtc } from 'd3-scale'
import { differenceInDays, format, isSameDay, startOfDay } from 'date-fns'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useComponentSize } from 'react-use-size'
import EmptyEventsTimeline from './EmptyEventsTimeline'
import EventBubbleLink from './EventBubbleLink'
import EventTooltip from './EventTooltip'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'

export const impactScale = scalePow([0, 100], [12, 80])

function EventsTimeline({ events, organisations }: EventsDataType) {
	const { width, ref } = useComponentSize()
	const { from, to, isPending } = useEvents()

	const timeScale = useMemo(() => {
		if (!from || !to) return
		return scaleUtc().domain([from, to])
	}, [from, to])

	const timeDiffInDays = useMemo(
		() => Math.abs(differenceInDays(to, from)),
		[from, to],
	)

	const eventDays = useMemo(() => {
		if (!timeScale) return []
		return (timeScale.ticks(timeDiffInDays) ?? []).map((d) => ({
			day: startOfDay(d),
			events: events.filter((e) => isSameDay(e.date, d)),
		}))
	}, [events, timeDiffInDays, timeScale])

	const xAxisTicks = useMemo(() => {
		if (!timeScale) return []
		return timeScale.ticks(width / 200)
	}, [timeScale, width])

	if (events.length === 0) return <EmptyEventsTimeline />
	return (
		<EventsTimelineWrapper ref={ref}>
			<EventsTimelineChartWrapper
				animationKey={[
					from?.toISOString(),
					to?.toISOString(),
					isPending.toString(),
				].join('-')}
			>
				{eventDays.map(({ day, events }) => (
					<motion.li
						key={`event-day-${day.toISOString()}`}
						className="flex flex-col gap-0.5"
						variants={fadeVariants}
						transition={{ staggerChildren: 0.01 }}
					>
						{events.map((event) => (
							<EventTooltip
								key={event.event_id}
								event={event}
								organisations={organisations}
							>
								<motion.div
									className="size-3 relative z-10 hover:z-20"
									style={{
										height: `${Math.ceil(impactScale(event.impact))}px`,
									}}
									variants={scaleInVariants}
								>
									<EventBubbleLink
										event={event}
										organisations={organisations}
									/>
								</motion.div>
							</EventTooltip>
						))}
					</motion.li>
				))}
			</EventsTimelineChartWrapper>
			{eventDays.length > 0 && (
				<>
					<ul
						aria-label="X Axis - Time"
						className="flex gap-0.5 items-center pb-6 justify-evenly min-w-full border-t border-grayMed px-1.5"
					>
						{eventDays.map(({ day }, idx) => (
							<li
								key={day.toISOString()}
								className="size-3 relative"
								aria-label="X Axis Tick"
							>
								<span
									className="w-px h-2 bg-grayMed absolute left-1/2 -translate-x-1/2"
									aria-hidden="true"
								/>
								{xAxisTicks.find((x) => isSameDay(x, day)) && (
									<span className="absolute left-1/2 top-full -translate-x-1/2 text-grayDark text-sm">
										{format(new Date(day), 'dd.MM.yyyy')}
									</span>
								)}
							</li>
						))}
					</ul>
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
				</>
			)}
		</EventsTimelineWrapper>
	)
}

export default EventsTimeline
