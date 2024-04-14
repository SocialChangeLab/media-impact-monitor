import { cn } from '@utility/classNames'
import { dateSortCompare } from '@utility/dateUtil'
import { type EventType, type EventsDataType } from '@utility/eventsUtil'
import { scaleLinear } from 'd3-scale'
import { addDays, format, isBefore, startOfDay } from 'date-fns'
import { AnimationProps, motion } from 'framer-motion'
import EventBubbleLink from './EventBubbleLink'
import EventTooltip from './EventTooltip'
import EventsTimelineWrapper from './EventsTimelinWrapper'

export const impactScale = scaleLinear([0, 1], [12, 64])

const eventVariants: AnimationProps['variants'] = {
	initial: { opacity: 0, scale: 0.5 },
	enter: { opacity: 1, scale: 1 },
}

const fadeVariants: AnimationProps['variants'] = {
	initial: { opacity: 0 },
	enter: { opacity: 1 },
}

function EventsTimeline({ events, organisations }: EventsDataType) {
	const eventsByDay = events.reduce((acc, event) => {
		const day = startOfDay(new Date(event.date)).toISOString()
		const newEvents = [...(acc.get(day) ?? []), event].sort((a, b) =>
			a.organizations[0].localeCompare(b.organizations[0]),
		)
		acc.set(day, newEvents)
		return acc
	}, new Map<string, EventType[]>())

	const sortedDays = [...eventsByDay.entries()]
		.map(([day, events]) => ({ day, events }))
		.sort((a, b) => dateSortCompare(a.day, b.day))

	const allDays = createAllDays(sortedDays.at(0)?.day, sortedDays.at(-1)?.day)
	const eventDays = allDays.map((day) => {
		const dayString = startOfDay(day)
		const events = eventsByDay.get(dayString.toISOString()) ?? []
		return { day: dayString, events }
	})

	return (
		<EventsTimelineWrapper>
			<motion.ul
				key="events-timeline-chart-wrapper"
				className="flex gap-0.5 items-center py-6 justify-evenly min-w-full bg-grayUltraLight min-h-96"
				variants={fadeVariants}
				initial="initial"
				animate="enter"
				transition={{ staggerChildren: 0.01 }}
			>
				{eventDays.map(({ day, events }) => (
					<motion.li
						key={day.toISOString()}
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
									variants={eventVariants}
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
			</motion.ul>
			{eventDays.length > 0 && (
				<>
					<ul
						aria-label="X Axis - Time"
						className="flex gap-0.5 items-center pb-6 justify-evenly min-w-full border-t border-grayMed"
					>
						{eventDays.map(({ day }, idx) => (
							<li
								key={day.toISOString()}
								className="size-3 relative"
								aria-hidden={idx % 4 !== 0 ? 'false' : 'true'}
								aria-label="X Axis Tick"
							>
								<span
									className="w-px h-2 bg-grayMed absolute left-1/2 -translate-x-1/2"
									aria-hidden="true"
								/>
								{idx % 4 === 0 && (
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

function createAllDays(start?: string, end?: string) {
	if (!start || !end) return []
	const days: Date[] = []
	let currentDate = startOfDay(new Date(start))
	const endDate = startOfDay(new Date(end))

	while (isBefore(currentDate, endDate)) {
		days.push(currentDate)
		currentDate = addDays(currentDate, 1)
	}

	return days
}

export default EventsTimeline
