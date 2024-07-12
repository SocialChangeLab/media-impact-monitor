import { cn } from "@/utility/classNames";
import type { OrganisationType } from "@/utility/eventsUtil";
import { memo, useMemo } from "react";
import RoundedColorPill from "./RoundedColorPill";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function OrgsLegendItem({
	org,
	otherOrgs,
}: {
	org: OrganisationType;
	otherOrgs?: OrganisationType[];
}) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const triggerContent = useMemo(() => {
		return (
			<li
				className={cn(
					"grid grid-cols-[auto_1fr_auto] gap-x-2 py-2",
					"items-center",
					`legend-org legend-org-${org.slug}`,
					`cursor-pointer`,
				)}
			>
				<RoundedColorPill color={org.color} />
				<span className="grid grid-cols-[1fr_auto] gap-4">
					<div className="truncate">{org.name.split(":")[0]}</div>
					<span className="font-mono text-xs text-grayDark">
						({org.count.toLocaleString("en-GB")})
					</span>
				</span>
			</li>
		);
	}, [org.slug]);
	if (org.isMain) {
		return (
			<Tooltip key={org.slug} delayDuration={50} disableHoverableContent>
				<TooltipTrigger asChild>{triggerContent}</TooltipTrigger>
				<Portal>
					<TooltipContent className="text-sm">{org.name}</TooltipContent>
				</Portal>
			</Tooltip>
		);
	}
	return (
		<Tooltip key={org.slug} delayDuration={50}>
			<TooltipTrigger asChild>{triggerContent}</TooltipTrigger>
			<Portal>
				<TooltipContent className="text-sm">
					<ul className="flex flex-col w-96 max-w-full">
						{otherOrgs?.map((subOrg) => (
							<li key={subOrg.slug} className="flex flex-col">
								<div className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-black/10">
									<span className="truncate">{subOrg.name}</span>
									<span className="font-mono text-xs text-black/45">
										({subOrg.count.toLocaleString("en-GB")})
									</span>
								</div>
							</li>
						))}
					</ul>
				</TooltipContent>
			</Portal>
		</Tooltip>
	);
}

export default memo(OrgsLegendItem);
