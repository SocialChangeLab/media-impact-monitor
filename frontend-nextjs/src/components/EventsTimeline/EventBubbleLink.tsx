import { cn } from '@utility/classNames'
import { EventType, OrganisationType } from '@utility/eventsUtil'
import Link from 'next/link'

type EventBubbleLinkProps = {
	event: EventType
	organisations: OrganisationType[]
	height: number
}

function EventBubbleLink({
	height,
	event,
	organisations,
}: EventBubbleLinkProps) {
	return (
		<Link
			href={`/events/${event.event_id}`}
			className={cn(
				'size-3 rounded-full bg-grayMed relative z-0 hover:z-10',
				'ring-0 ring-fg transition-all hover:ring-2',
				'ring-offset-0 ring-offset-bg hover:ring-offset-2',
				'focus-visible:ring-offset-2 focus-visible:ring-2',
			)}
			style={{
				height: `${Math.ceil(height)}px`,
				backgroundColor: organisations.find(
					(x) =>
						x.name.toLocaleLowerCase() ===
						event.organizations[0].toLocaleLowerCase(),
				)?.color,
			}}
		/>
	)
}

export default EventBubbleLink
