import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { OrganisationType } from "@/utility/eventsUtil";
import { type ReactNode, forwardRef } from "react";

const EventsBar = forwardRef<
	HTMLDivElement,
	{ height: number; organisations: OrganisationType[]; children: ReactNode }
>(({ height, organisations, children }, ref) => (
	<div className="rounded-full bg-grayUltraLight" ref={ref}>
		<div
			className={cn(
				"size-3 relative z-10 hover:z-20",
				"event-item transition-all",
				organisations.map((org) => {
					const isMain = org?.isMain ?? false;
					return `event-item-org-${
						isMain
							? slugifyCssClass(org.name) || "unknown-organisation"
							: "other"
					}`;
				}),
			)}
			style={{ height: `${height}px` }}
		>
			{children}
		</div>
	</div>
));

export default EventsBar;
