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
				count: events.filter((event) => event.organizers.includes(org.name))
					.length,
				isSelected: !!selectedOrganisations.find((x) => x.name === org.name),
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
			<TooltipContent>
				<p className="text-base pt-2 pb-3 max-w-80">
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
					{`, and ${orgs.length > 1 ? "were" : "was"} organized by the following organization${orgs.length > 1 ? "s" : ""}:`}
				</p>
				{orgs.map((org) => (
					<OrgLine key={org.name} {...org} />
				))}
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(AggregatedEventsTooltip);
