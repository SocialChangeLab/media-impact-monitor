import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "@/utility/dateUtil";
import {
	type OrganisationType,
	type ParsedEventType,
	compareOrganizationsByColors,
} from "@/utility/eventsUtil";
import { getTopicAwareTexts } from "@/utility/textUtil";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { type ReactNode, memo, useMemo } from "react";
import OrgLine from "./EventTooltipOrgLine";
import {
	type AggregationUnitType,
	formatDateByAggregationUnit,
} from "./useAggregationUnit";

function AggregatedEventsTooltip({
	date,
	sumSize,
	aggregationUnit,
	events,
	organisations,
	selectedOrganisations,
	children,
}: {
	date: Date;
	sumSize: number | undefined;
	aggregationUnit: AggregationUnitType;
	events: ParsedEventType[];
	organisations: OrganisationType[];
	selectedOrganisations: OrganisationType[];
	children: ReactNode;
}) {
	const topic = useFiltersStore(({ topic }) => topic);
	const texts = getTopicAwareTexts(topic);
	
	const formattedDate = useMemo(
		() => formatDateByAggregationUnit(date, aggregationUnit),
		[date, aggregationUnit],
	);

	const orgs = useMemo(() => {
		return organisations
			.map((org) => ({
				...org,
				count: events.filter((event) =>
					event.organizers.find((x) => x.slug === org.slug),
				).length,
				isSelected: !!selectedOrganisations.find((x) => x.slug === org.slug),
			}))
			.sort((a, b) => {
				if (selectedOrganisations.length === 0)
					return compareOrganizationsByColors(a, b);
				if (a.isSelected && !b.isSelected) return -1;
				if (!a.isSelected && b.isSelected) return 1;
				return compareOrganizationsByColors(a, b);
			});
	}, [organisations, selectedOrganisations, events]);

	return (
		<Tooltip>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent className="px-0">
				<p className="text-base pt-2 pb-3 max-w-80 px-4">
					{texts.charts.protest_timeline.tooltips.aggregated({
						timeUnitLabel:
							texts.charts.aggregationUnit[
								aggregationUnit as keyof typeof texts.charts.aggregationUnit
							],
						timeValue:
							aggregationUnit === "month"
								? format(date, "LLLL yyyy")
								: formattedDate,
						protestCount: events.length,
						participantCount: sumSize,
						orgsCount: orgs.length,
					})}
				</p>
				{orgs.map((org) => (
					<OrgLine key={org.slug} {...org} />
				))}
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(AggregatedEventsTooltip);
