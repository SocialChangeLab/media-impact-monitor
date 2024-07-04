import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { memo } from "react";
import AggregatedEventsTooltip from "./AggregatedEventsTooltip";
import { AggregatedEventsBubble } from "./EventBubbleLink";
import EventsBar from "./EventsBar";
import type { AggregationUnitType } from "./useAggregationUnit";

export type AggregatedItemType = {
	date: Date;
	height: number;
	organisations: OrganisationType[];
	selectedOrganisations: OrganisationType[];
	events: ParsedEventType[];
	sumSize: number | undefined;
	aggregationUnit: AggregationUnitType;
};

function EventsTimelineAggregatedItem(aggregatedItem: AggregatedItemType) {
	return (
		<AggregatedEventsTooltip {...aggregatedItem}>
			<EventsBar {...aggregatedItem}>
				<AggregatedEventsBubble {...aggregatedItem} />
			</EventsBar>
		</AggregatedEventsTooltip>
	);
}

export default memo(EventsTimelineAggregatedItem);
