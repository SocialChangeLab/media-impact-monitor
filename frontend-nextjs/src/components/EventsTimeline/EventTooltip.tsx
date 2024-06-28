import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/utility/classNames";
import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { type PropsWithChildren, useMemo, useState } from "react";
import { Button } from "../ui/button";
import OrgLine from "./EventTooltipOrgLine";

function EventTooltip({
	event,
	organisations,
	selectedOrganisations,
	children,
}: PropsWithChildren<{
	event: ParsedEventType;
	organisations: OrganisationType[];
	selectedOrganisations: OrganisationType[];
}>) {
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);
	const orgs = useMemo(() => {
		const unknownOrgName = "Unknown organisation";
		const mappedOrgs = event.organizers
			.map((orgName) => {
				const org = organisations.find((x) => x.name === orgName);
				if (!org) return;
				return {
					...org,
					isSelected: !!selectedOrganisations.find((x) => x.name === org.name),
					name: org.name.trim() || unknownOrgName,
				};
			})
			.filter(Boolean) as (OrganisationType & { isSelected: boolean })[];
		return mappedOrgs;
	}, [event.organizers, organisations, selectedOrganisations]);

	const formattedDate = useMemo(
		() => format(new Date(event.date), "EEEE d MMMM yyyy"),
		[event.date],
	);

	const formattedImpact = useMemo(
		() =>
			event.size_number
				? Math.round(event.size_number).toLocaleString("en-GB")
				: "?",
		[event.size_number],
	);

	return (
		<Tooltip delayDuration={50}>
			{children}
			<TooltipContent>
				<ul
					className={cn(
						"flex justify-between items-center border-b py-2",
						"mb-2 border-grayLight",
					)}
				>
					<li className="flex gap-4 items-center font-bold font-headlines text-base">
						{formattedDate}
					</li>
					<li className={cn("flex gap-2 items-center")}>
						<Users size={16} className={cn("text-grayDark")} />
						<span>{formattedImpact}</span>
					</li>
				</ul>
				<p
					className={cn(
						"max-w-80 text-xs mb-1",
						!descriptionExpanded && "line-clamp-3",
					)}
				>
					{event.description}
				</p>
				<Button
					variant="ghost"
					onClick={() => setDescriptionExpanded(!descriptionExpanded)}
					className="text-xs font-medium px-1 py-0.5 -translate-x-1 -mt-0.5 h-auto mb-3 hover:translate-x-0 transition"
				>
					{descriptionExpanded ? "Show less" : "Show more"}
				</Button>
				{orgs.map((org) => (
					<OrgLine key={org.name} {...org} />
				))}
			</TooltipContent>
		</Tooltip>
	);
}

export default EventTooltip;
