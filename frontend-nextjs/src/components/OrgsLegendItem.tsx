import { cn } from "@/utility/classNames";
import type { OrganisationType } from "@/utility/eventsUtil";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo, useMemo } from "react";
import OrgsTooltip from "./OrgsTooltip";
import RoundedColorPill from "./RoundedColorPill";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function OrgsLegendItem({
	org,
	otherOrgs,
}: {
	org: OrganisationType;
	otherOrgs?: OrganisationType[];
}) {
	const searchParams = useSearchParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const triggerContent = useMemo(() => {
		return (
			<>
				<RoundedColorPill color={org.color} />
				<span className="grid grid-cols-[1fr_auto] gap-4">
					<div className="truncate">{org.name.split(":")[0]}</div>
					<span className="font-mono text-xs text-grayDark">
						({org.count.toLocaleString("en-GB")})
					</span>
				</span>
			</>
		);
	}, [org.slug, searchParams]);

	if (org.isMain) {
		return (
			<Tooltip key={org.slug} delayDuration={50} disableHoverableContent>
				<TooltipTrigger asChild>
					<li>
						<Link
							href={`/organisations/${org.slug}?${searchParams.toString()}`}
							className={cn(
								"grid grid-cols-[auto_1fr_auto] gap-x-2 py-2",
								"items-center",
								org.isMain && `legend-org legend-org-${org.slug}`,
								`cursor-pointer`,
							)}
						>
							{triggerContent}
						</Link>
					</li>
				</TooltipTrigger>
				<Portal>
					<TooltipContent className="text-sm">{org.name}</TooltipContent>
				</Portal>
			</Tooltip>
		);
	}
	return (
		<OrgsTooltip otherOrgs={otherOrgs}>
			<li>
				<span
					className={cn(
						"grid grid-cols-[auto_1fr_auto] gap-x-2 py-2",
						`items-center cursor-pointer`,
					)}
				>
					{triggerContent}
				</span>
			</li>
		</OrgsTooltip>
	);
}

export default memo(OrgsLegendItem);
