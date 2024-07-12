import { cn } from "@/utility/classNames";
import type { OrganisationType } from "@/utility/eventsUtil";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import RoundedColorPill from "./RoundedColorPill";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function OrgsTooltip({
	otherOrgs,
	children,
	withPills = false,
}: {
	otherOrgs?: OrganisationType[];
	children: ReactNode;
	withPills?: boolean;
}) {
	const searchParams = useSearchParams();
	return (
		<Tooltip delayDuration={50}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<Portal>
				<TooltipContent className="text-sm" side="bottom">
					<ul className="flex flex-col w-96 max-w-full legend-orgs-container">
						{otherOrgs?.map((subOrg) => (
							<li key={subOrg.slug} className={cn("flex flex-col")}>
								<Link
									href={`/organisations/${subOrg.slug}?${searchParams.toString()}`}
									className={cn(
										"grid gap-2 py-2 border-b border-black/10 items-center",
										`legend-org legend-org-${subOrg.slug}`,
										withPills
											? "grid-cols-[auto_1fr_auto]"
											: "grid-cols-[1fr_auto]",
									)}
								>
									{withPills && <RoundedColorPill color={subOrg.color} />}
									<span className="truncate">{subOrg.name}</span>
									<span className="font-mono text-xs text-black/45">
										({subOrg.count.toLocaleString("en-GB")})
									</span>
								</Link>
							</li>
						))}
					</ul>
				</TooltipContent>
			</Portal>
		</Tooltip>
	);
}

export default OrgsTooltip;
