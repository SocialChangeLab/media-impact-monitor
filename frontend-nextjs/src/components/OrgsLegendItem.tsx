import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { OrganisationType } from "@/utility/eventsUtil";
import { memo, useMemo } from "react";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function OrgsLegendItem({
	org,
	otherOrgs,
}: {
	org: OrganisationType;
	otherOrgs?: OrganisationType[];
}) {
	const triggerContent = useMemo(() => {
		return (
			<li
				className={cn(
					"grid grid-cols-[auto_1fr_auto] gap-x-2 py-2",
					"items-center",
					`legend-org legend-org-${slugifyCssClass(org.name)}`,
					`cursor-pointer`,
				)}
			>
				<span
					className={cn(
						"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
					)}
					style={{ backgroundColor: org.color }}
					aria-hidden="true"
				/>
				<span className="grid grid-cols-[1fr_auto] gap-4">
					<div className="truncate">{org.name.split(":")[0]}</div>
					<span className="font-mono text-xs text-grayDark">
						({org.count.toLocaleString("en-GB")})
					</span>
				</span>
			</li>
		);
	}, [org.name, org.color, org.count]);
	if (org.isMain) {
		return (
			<Tooltip key={org.name} delayDuration={50} disableHoverableContent>
				<TooltipTrigger asChild>{triggerContent}</TooltipTrigger>
				<Portal>
					<TooltipContent className="text-sm">{org.name}</TooltipContent>
				</Portal>
			</Tooltip>
		);
	}
	return (
		<Tooltip key={org.name} delayDuration={50}>
			<TooltipTrigger asChild>{triggerContent}</TooltipTrigger>
			<Portal>
				<TooltipContent className="text-sm">
					<ul className="flex flex-col w-96 max-w-full">
						{otherOrgs?.map((subOrg) => (
							<li key={subOrg.name} className="flex flex-col">
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
