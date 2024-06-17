import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { memo, useMemo } from "react";
import EventBubbleLink from "./EventBubbleLink";
import EventTooltip from "./EventTooltip";
import EventsBar from "./EventsBar";

type EventTimelineItemProps = {
	event: ParsedEventType;
	organisations: OrganisationType[];
	height: number;
};
function EventTimelineItem({
	event,
	organisations,
	height,
}: EventTimelineItemProps) {
	const mappedOrganisations = useMemo(
		() =>
			event.organizers
				.map((x) => organisations.find((y) => y.name === x))
				.filter(Boolean) as OrganisationType[],
		[event.organizers, organisations],
	);
	return (
		<EventTooltip
			key={event.event_id}
			event={event}
			organisations={mappedOrganisations}
		>
			<EventsBar height={height} organisations={mappedOrganisations}>
				<EventBubbleLink event={event} organisations={mappedOrganisations} />
			</EventsBar>
		</EventTooltip>
	);
}

export default memo(EventTimelineItem);
