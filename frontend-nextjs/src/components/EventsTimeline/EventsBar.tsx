import { cn } from "@/utility/classNames";
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
				organisations.map(
					(org) => `event-item-org-${org.slug || "unknown-organisation"}`,
				),
			)}
			style={{ height: `${height}px` }}
		>
			{children}
		</div>
	</div>
));

export default EventsBar;
