import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type OrganisationType,
	type ParsedEventType,
	compareOrganizationsByColors,
} from "@/utility/eventsUtil";
import { format } from "date-fns";
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
					The {aggregationUnit} of{" "}
					<strong>
						{aggregationUnit === "month"
							? format(date, "LLLL yyyy")
							: formattedDate}
					</strong>{" "}
					saw a total of{" "}
					<strong>
						{events.length.toLocaleString("en-GB")} protest
						{events.length > 1 && "s"}
					</strong>
					{sumSize && (
						<>
							, comprising of{" "}
							<strong>{sumSize.toLocaleString("en-GB")} participants</strong>
						</>
					)}
					{organisations.length > 1 &&
						", and was organized by the following organizations:"}
				</p>
				{orgs.map((org) => (
					<OrgLine key={org.slug} {...org} />
				))}
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(AggregatedEventsTooltip);
