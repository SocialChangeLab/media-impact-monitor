import { addDay, dayStart, format, isBefore, parse } from '@formkit/tempo'
import { cn } from '@utility/classNames'
import { dateSortCompare } from '@utility/dateUtil'
import { type EventDataType, type EventType } from '@utility/eventsUtil'
import { scaleLinear } from 'd3-scale'
import EventBubbleLink from './EventBubbleLink'
import EventTooltip from './EventTooltip'

const impactScale = scaleLinear([0, 1], [12, 64])

function EventsTimeline({ events, organisations }: EventDataType) {
	const eventsByDay = events.reduce((acc, event) => {
		const day = dayStart(parse(event.date)).toISOString()
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
		const dayString = dayStart(day).toISOString()
		const events = eventsByDay.get(dayString) ?? []
		return { day: dayString, events }
	})

	return (
		<div className="w-full overflow-x-auto">
			<ul className="flex gap-0.5 items-center py-6 justify-evenly min-w-full bg-grayUltraLight min-h-96">
				{eventDays.length === 0 && (
					<p>No events for this filter configuration</p>
				)}
				{eventDays.map(({ day, events }) => (
					<li key={day} className="flex flex-col gap-0.5">
						{events.map((event) => (
							<EventTooltip
								key={event.event_id}
								event={event}
								organisations={organisations}
							>
								<EventBubbleLink
									event={event}
									organisations={organisations}
									height={impactScale(event.impact)}
								/>
							</EventTooltip>
						))}
					</li>
				))}
			</ul>
			{eventDays.length > 0 && (
				<>
					<ul
						aria-label="X Axis - Time"
						className="flex gap-0.5 items-center pb-6 justify-evenly min-w-full border-t border-grayMed"
					>
						{eventDays.map(({ day }, idx) => (
							<li
								key={day}
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
										{format(parse(day), 'DD.MM.YYYY', 'en-GB')}
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
		</div>
	)
}

function createAllDays(start?: string, end?: string) {
	if (!start || !end) return []
	const days: Date[] = []
	let currentDate = dayStart(parse(start))
	const endDate = dayStart(parse(end))

	while (isBefore(currentDate, endDate)) {
		days.push(currentDate)
		currentDate = addDay(currentDate)
	}

	return days
}

export default EventsTimeline
