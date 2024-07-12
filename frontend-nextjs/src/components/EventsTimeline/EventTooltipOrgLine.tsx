import { cn } from "@/utility/classNames";
import type { OrganisationType } from "@/utility/eventsUtil";

export default function OrgLine(
	org: OrganisationType & {
		isSelected: boolean;
	},
) {
	return (
		<div
			key={org.slug}
			className={cn(
				"grid grid-cols-[auto_1fr_auto] gap-x-2 items-center",
				"border-t border-black/5 py-1",
			)}
		>
			<span
				className={cn(
					"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
				)}
				style={{ backgroundColor: org.color }}
				aria-hidden="true"
			/>
			<span className={cn(org.isSelected && "font-bold", "truncate max-w-64")}>
				{org.name}
			</span>
		</div>
	);
}
