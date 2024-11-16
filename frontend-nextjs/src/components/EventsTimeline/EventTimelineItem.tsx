import type { OrganisationType, ParsedEventType } from '@/utility/eventsUtil'
import { memo, useMemo } from 'react'
import EventBubbleLink from './EventBubbleLink'
import EventTooltip from './EventTooltip'
import EventsBar from './EventsBar'

type EventTimelineItemProps = {
	event: ParsedEventType
	organisations: OrganisationType[]
	height: number
}
function EventTimelineItem({
	event,
	organisations,
	height,
}: EventTimelineItemProps) {
	const selectedOrgs = useMemo(
		() =>
			event.organizers
				.map((x) => organisations.find((y) => y.slug === x.slug))
				.filter(Boolean) as OrganisationType[],
		[event.organizers, organisations],
	)
	return (
		<EventTooltip
			key={event.event_id}
			event={event}
			organisations={selectedOrgs}
		>
			<EventsBar height={height} organisations={selectedOrgs}>
				<EventBubbleLink event={event} organisations={selectedOrgs} />
			</EventsBar>
		</EventTooltip>
	)
}

export default memo(EventTimelineItem)
