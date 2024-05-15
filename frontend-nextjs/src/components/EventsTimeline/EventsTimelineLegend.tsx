"use client";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import useEvents from "@/utility/useEvents";

function EventsTimelineLegend() {
	const legendOrganisations = useEvents().data?.organisations;

	if (legendOrganisations.length === 0) return null;
	return (
		<div className="mt-6 flex flex-col gap-2">
			<h4 className="text-lg font-bold font-headlines antialiased relative">
				<span className="w-fit pr-4 bg-bg relative z-20">Legend</span>
				<span className="h-px w-full bg-grayLight absolute top-1/2 z-10"></span>
			</h4>
			<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8">
				{legendOrganisations.map((org) => (
					<li
						key={org.name}
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
						<span className="truncate">{org.name}</span>
						<span className="font-mono text-xs">{org.count}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default EventsTimelineLegend;
