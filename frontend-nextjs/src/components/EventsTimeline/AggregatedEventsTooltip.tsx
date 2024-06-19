import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utility/classNames";
import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { format } from "date-fns";
import { type ReactNode, memo, useMemo } from "react";
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
	children,
}: {
	date: Date;
	sumSize: number | undefined;
	aggregationUnit: AggregationUnitType;
	events: ParsedEventType[];
	organisations: OrganisationType[];
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
			}))
			.sort((a, b) => {
				if (a.count > b.count) return -1;
				if (a.count < b.count) return 1;
				return a.name.localeCompare(b.name);
			});
	}, [organisations, events]);

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
					{organisations.length > 1 &&
						", and was organized by the following organizations:"}
				</p>
				{orgs.map((org) => (
					<div
						key={org.name}
						className={cn(
							"grid grid-cols-[auto_1fr_auto] gap-x-2 items-center",
							"border-t border-black/5 py-1",
						)}
					>
						<span
							className={cn(
								"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
							)}
							style={{ backgroundColor: org.color }}
							aria-hidden="true"
						/>
						<span className="truncate max-w-64">{org.name}</span>
					</div>
				))}
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(AggregatedEventsTooltip);
