import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import { memo } from "react";
import AggregatedEventsTooltip from "./AggregatedEventsTooltip";
import { AggregatedEventsBubble } from "./EventBubbleLink";
import EventsBar from "./EventsBar";
import type { AggregationUnitType } from "./useAggregationUnit";

function EventsTimelineAggregatedItem({
	date,
	height,
	organisations,
	events,
	sumSize,
	aggregationUnit,
}: {
	date: Date;
	height: number;
	organisations: OrganisationType[];
	events: EventType[];
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
		>
			<EventsBar height={height} organisations={organisations}>
				<AggregatedEventsBubble organisations={organisations} />
			</EventsBar>
		</AggregatedEventsTooltip>
	);
}

export default memo(EventsTimelineAggregatedItem);
