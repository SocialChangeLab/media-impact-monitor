"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import type { OrganisationType } from "@/utility/eventsUtil";
import InternalLink from "../InternalLink";

export default function OrgLine(
	org: OrganisationType & {
		isSelected: boolean;
	},
) {
	const { organizers } = useFiltersStore((state) => ({
		organizers: state.organizers,
	}));
	return (
		<InternalLink
			href={`/organisations/${org.slug}`}
			key={org.slug}
			className={cn(
				"grid grid-cols-[auto_1fr_auto] gap-x-2 items-center focusable",
				"border-t border-grayLight py-1 px-4 hover:bg-grayUltraLight",
				"hover:text-fg hover:font-semibold transition-all first-of-type:border-t-0",
			)}
		>
			<span
				className={cn(
					"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
				)}
				style={{ backgroundColor: org.color }}
				aria-hidden="true"
			/>
			<span
				className={cn(
					org.isSelected && organizers.length > 1 && "font-semibold",
					!org.isSelected && "text-grayDark",
					"truncate max-w-64",
				)}
			>
				{org.name}
			</span>
			{!org.isSelected && organizers.length > 1 && (
				<span className="text-grayDark opacity-80">(not selected)</span>
			)}
		</InternalLink>
	);
}
