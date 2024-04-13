import { cn } from '@utility/classNames'
import { EventType, OrganisationType } from '@utility/eventsUtil'
import Link from 'next/link'

type EventBubbleLinkProps = {
	event: EventType
	organisations: OrganisationType[]
}

function EventBubbleLink({ event, organisations }: EventBubbleLinkProps) {
	const orgName = event.organizations[0]
	const eventOrgObj = organisations.find((x) => x.name === orgName)
	const backgroundColor = eventOrgObj?.color
	return (
		<Link
			href={`/events/${event.event_id}`}
			className={cn(
				'absolute inset-0 rounded-full bg-grayMed',
				'ring-0 ring-fg transition-all hover:ring-2',
				'ring-offset-0 ring-offset-bg hover:ring-offset-2',
				'focus-visible:ring-offset-2 focus-visible:ring-2',
			)}
			style={{ backgroundColor }}
		/>
	)
}

export default EventBubbleLink
