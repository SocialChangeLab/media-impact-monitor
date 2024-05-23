"use client";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { OrganisationType } from "@/utility/eventsUtil";
import { useMemo } from "react";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function OrgsLegend({
	organisations,
}: {
	organisations: OrganisationType[];
}) {
	const { allOrgs, otherOrgs } = useMemo(() => {
		const mainOrgs: OrganisationType[] = [];
		const otherOrgs: OrganisationType[] = [];

		for (const org of organisations) {
			if (!org.isMain) otherOrgs.push(org);
			else mainOrgs.push(org);
		}

		if (otherOrgs.length === 0) return { allOrgs: mainOrgs, otherOrgs: [] };
		return {
			allOrgs: [
				...mainOrgs,
				{
					name: "Other",
					count: otherOrgs.reduce((acc, org) => acc + org.count, 0),
					color: `var(--grayDark)`,
					isMain: false,
					orgs: otherOrgs.sort((a, b) => {
						if (a.count > b.count) return -1;
						if (a.count < b.count) return 1;
						return a.name.localeCompare(b.name);
					}),
				},
			],
			otherOrgs,
			mainOrgs,
		};
	}, [organisations]);

	if (allOrgs.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold">Color</h5>
			<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] gap-x-6 relative z-20">
				{allOrgs.map((org) => (
					<Tooltip key={org.name}>
						<TooltipTrigger asChild>
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
									<div className="truncate">{org.name}</div>
									<span className="font-mono text-xs text-grayDark">
										({org.count.toLocaleString("en-GB")})
									</span>
								</span>
							</li>
						</TooltipTrigger>
						{!org.isMain && (
							<Portal>
								<TooltipContent className="text-sm">
									{!org.isMain && (
										<ul className="flex flex-col w-96 max-w-full">
											{otherOrgs?.map((subOrg) => (
												<li key={subOrg.name} className="flex flex-col">
													<div className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-black/10">
														<span className="truncate">{subOrg.name}</span>
														<span className="font-mono text-xs text-black/45">
															{subOrg.count.toLocaleString("en-GB")}
														</span>
													</div>
												</li>
											))}
										</ul>
									)}
								</TooltipContent>
							</Portal>
						)}
					</Tooltip>
				))}
			</ul>
		</div>
	);
}

export default OrgsLegend;
