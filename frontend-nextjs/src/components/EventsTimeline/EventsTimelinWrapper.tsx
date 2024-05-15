"use client";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { OrganisationType } from "@/utility/eventsUtil";
import { type PropsWithChildren, forwardRef } from "react";

const EventsTimelineWrapper = forwardRef<
	HTMLDivElement,
	PropsWithChildren<{
		organisations?: OrganisationType[];
	}>
>(({ children, organisations = [] }, ref) => {
	return (
		<div className="events-timeline w-full relative" ref={ref}>
			<style jsx global>{`
				.events-timeline:has(.legend-org:hover) .event-item {
					opacity: 0.1 !important;
				}
				${organisations
					.map((org) => {
						const slug = slugifyCssClass(org.name);
						return `
								.events-timeline:has(.legend-org-${slug}:hover)
									.event-item-org-${slug} {
										opacity: 1 !important;
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
