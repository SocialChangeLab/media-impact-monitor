import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import EventBubbleLink from "./EventBubbleLink";
import EventTooltip from "./EventTooltip";
import EventsBar from "./EventsBar";

type EventTimelineItemProps = {
	event: EventType;
	organisations: OrganisationType[];
	height: number;
};
function EventTimelineItem({
	event,
	organisations,
	height,
}: EventTimelineItemProps) {
	return (
		<EventTooltip
			key={event.event_id}
			event={event}
			organisations={organisations}
		>
			<EventsBar height={height} organisations={organisations}>
				<EventBubbleLink event={event} organisations={organisations} />
			</EventsBar>
		</EventTooltip>
	);
}

export default EventTimelineItem;
