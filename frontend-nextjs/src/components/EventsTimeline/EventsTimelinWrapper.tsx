"use client";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { OrganisationType } from "@/utility/eventsUtil";
import { forwardRef, type PropsWithChildren } from "react";

const EventsTimelineWrapper = forwardRef<
	HTMLDivElement,
	PropsWithChildren<{
		organisations?: OrganisationType[];
	}>
>(({ children, organisations = [] }, ref) => {
	return (
		<div
			className="events-timeline w-full relative pt-[w-[max(1rem,2vmax)]"
			ref={ref}
		>
			<style jsx global>{`
				.events-timeline:has(.legend-org:hover) .event-item {
					opacity: 0.2 !important;
					filter: grayscale(100%) !important;
				}
				${organisations
					.map((org) => {
						const slug = org.isMain ? slugifyCssClass(org.name) : "other";
						return `
								.events-timeline:has(.legend-org-${slug}:hover)
									.event-item-org-${slug} {
										opacity: 1 !important;
										filter: grayscale(0%) !important;
									}
								`;
					})
					.join("")}
			`}</style>
			{children}
		</div>
	);
});

EventsTimelineWrapper.displayName = "EventsTimelineWrapper";

export default EventsTimelineWrapper;
