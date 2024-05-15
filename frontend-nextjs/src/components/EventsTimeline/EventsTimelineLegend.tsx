"use client";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { OrganisationType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import { useMemo } from "react";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function EventsTimelineLegend() {
	const legendOrganisations = useEvents().data?.organisations;

	const { allOrgs, otherOrgs } = useMemo(() => {
		const mainOrgs: OrganisationType[] = [];
		const otherOrgs: OrganisationType[] = [];

		for (const org of legendOrganisations) {
			if (!org.isMain) otherOrgs.push(org);
			else mainOrgs.push(org);
		}

		return {
			allOrgs: [
				...mainOrgs,
				{
					name: "Other",
					count: otherOrgs.reduce((acc, org) => acc + org.count, 0),
					color: otherOrgs[0].color,
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
	}, [legendOrganisations]);

	if (allOrgs.length === 0) return null;
	return (
		<div className="mt-6 flex flex-col gap-2 w-screen px-6 -ml-6">
			<h4 className="text-lg font-bold font-headlines antialiased relative z-10">
				<span className="w-fit pr-4 bg-bg relative z-20">Legend</span>
				<span className="h-px w-full bg-grayLight absolute top-1/2 left-0 z-10"></span>
			</h4>
			<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 relative z-20">
				{allOrgs.map((org) => (
					<Tooltip key={org.name}>
						<TooltipTrigger asChild>
							<li
								className={cn(
									"grid grid-cols-[auto_1fr_auto] gap-x-2",
									"items-center border-b border-b-grayLight py-2",
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
								<span className="truncate">
									{org.name}
									{!org.isMain && ` (${org.count.toLocaleString("en-GB")})`}
								</span>
								<span className="font-mono text-xs">
									{org.count.toLocaleString("en-GB")}
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
													<div className="grid grid-cols-[1fr_auto] gap-4 py-2 border-b border-grayLight">
														<span className="truncate">{subOrg.name}</span>
														<span className="font-mono text-xs text-grayDark">
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

export default EventsTimelineLegend;
