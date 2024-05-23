import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utility/classNames";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { useMemo, type PropsWithChildren } from "react";

function EventTooltip({
	event,
	organisations,
	children,
}: PropsWithChildren<{ event: EventType; organisations: OrganisationType[] }>) {
	const orgs = useMemo(() => {
		const unknownOrgName = "Unknown organisation";
		const mappedOrgs = event.organizers
			.map((orgName) => {
				const org = organisations.find((x) => x.name === orgName);
				if (!org) return;
				return {
					...org,
					name: org.name.trim() || unknownOrgName,
				};
			})
			.filter(Boolean) as OrganisationType[];
		return mappedOrgs;
	}, [event.organizers, organisations]);

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
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent>
				<ul
					className={cn(
						"flex justify-between items-center border-b py-2",
						"mb-2 border-black/10",
					)}
				>
					<li className="flex gap-4 items-center">{formattedDate}</li>
					<li className={cn("flex gap-2 items-center")}>
						<Users size={16} className={cn("text-black/60")} />
						<span>{formattedImpact}</span>
					</li>
				</ul>
				<p className="max-w-80 line-clamp-3 text-xs mb-3">
					{event.description}
				</p>
				{orgs.map((org) => (
					<div
						key={org.name}
						className={cn(
							"grid grid-cols-[auto_1fr] gap-x-2 items-center",
							"border-t border-white/10 dark:border-black/10 py-2",
						)}
					>
						<span
							className={cn(
								"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
							)}
							style={{ backgroundColor: org.color }}
							aria-hidden="true"
						/>
						<span className="truncate">{org.name}</span>
					</div>
				))}
			</TooltipContent>
		</Tooltip>
	);
}

export default EventTooltip;
