import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { memo } from "react";
import AggregatedEventsTooltip from "./AggregatedEventsTooltip";
import { AggregatedEventsBubble } from "./EventBubbleLink";
import EventsBar from "./EventsBar";
import type { AggregationUnitType } from "./useAggregationUnit";

function EventsTimelineAggregatedItem({
	date,
	height,
	organisations,
	selectedOrganisations,
	events,
	sumSize,
	aggregationUnit,
}: {
	date: Date;
	height: number;
	organisations: OrganisationType[];
	selectedOrganisations: OrganisationType[];
	events: ParsedEventType[];
	sumSize: number | undefined;
	aggregationUnit: AggregationUnitType;
}) {
	return (
		<AggregatedEventsTooltip
			date={date}
			events={events}
			sumSize={sumSize}
			aggregationUnit={aggregationUnit}
			organisations={organisations}
			selectedOrganisations={selectedOrganisations}
		>
			<EventsBar height={height} organisations={organisations}>
				<AggregatedEventsBubble organisations={selectedOrganisations} />
			</EventsBar>
		</AggregatedEventsTooltip>
	);
}

export default memo(EventsTimelineAggregatedItem);
