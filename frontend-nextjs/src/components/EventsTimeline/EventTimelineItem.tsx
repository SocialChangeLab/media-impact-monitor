import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { memo, useMemo } from "react";
import EventBubbleLink from "./EventBubbleLink";
import EventTooltip from "./EventTooltip";
import EventsBar from "./EventsBar";

type EventTimelineItemProps = {
	event: ParsedEventType;
	organisations: OrganisationType[];
	selectedOrganisations: OrganisationType[];
	height: number;
};
function EventTimelineItem({
	event,
	organisations,
	selectedOrganisations,
	height,
}: EventTimelineItemProps) {
	const mappedOrganisations = useMemo(
		() =>
			event.organizers
				.map((x) => organisations.find((y) => y.slug === x.slug))
				.filter(Boolean) as OrganisationType[],
		[event.organizers, organisations],
	);
	const selectedOrganisationsMapped = useMemo(
		() =>
			event.organizers
				.filter((x) => selectedOrganisations.find((y) => y.slug === x.slug))
				.map((x) => organisations.find((y) => y.slug === x.slug))
				.filter(Boolean) as OrganisationType[],
		[event.organizers, selectedOrganisations, organisations],
	);
	return (
		<EventTooltip
			key={event.event_id}
			event={event}
			organisations={mappedOrganisations}
			selectedOrganisations={selectedOrganisationsMapped}
		>
			<EventsBar height={height} organisations={mappedOrganisations}>
				<EventBubbleLink
					event={event}
					organisations={selectedOrganisationsMapped}
				/>
			</EventsBar>
		</EventTooltip>
	);
}

export default memo(EventTimelineItem);
