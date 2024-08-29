import { cn } from "@/utility/classNames";
import { texts } from "@/utility/textUtil";
import type { ReactNode } from "react";
import type { LegendOrganisation } from "./EventsTimeline/EventsTimelineLegend";
import InternalLink from "./InternalLink";
import RoundedColorPill from "./RoundedColorPill";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function OrgsTooltip({
	otherOrgs,
	children,
	withPills = false,
}: {
	otherOrgs?: LegendOrganisation[];
	children: ReactNode;
	withPills?: boolean;
}) {
	return (
		<Tooltip delayDuration={50}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<Portal>
				<TooltipContent className="text-sm px-0" side="bottom">
					<ul className="flex flex-col w-96 max-w-full legend-orgs-container">
						{otherOrgs?.map((subOrg) => (
							<li key={subOrg.slug} className={cn("flex flex-col")}>
								<InternalLink
									href={`/organisations/${subOrg.slug}`}
									className={cn(
										"grid gap-2 py-2 text-grayDark focusable",
										"border-b border-grayLight items-center",
										`legend-org legend-org-${subOrg.slug}`,
										`hover:bg-grayUltraLight hover:text-fg transition-all`,
										`hover:font-semibold px-4`,
										withPills
											? "grid-cols-[auto_1fr_auto]"
											: "grid-cols-[1fr_auto]",
									)}
								>
									{withPills && <RoundedColorPill color={subOrg.color} />}
									<span className="truncate">{subOrg.name}</span>
									{subOrg.count && (
										<span className="font-mono text-xs text-black/45">
											({subOrg.count.toLocaleString(texts.language)})
										</span>
									)}
								</InternalLink>
							</li>
						))}
					</ul>
				</TooltipContent>
			</Portal>
		</Tooltip>
	);
}

export default OrgsTooltip;
