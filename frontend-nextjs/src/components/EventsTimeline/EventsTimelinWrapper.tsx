'use client'
import { slugifyCssClass } from '@/utility/cssSlugify'
import useEvents from '@/utility/useEvents'
import { PropsWithChildren, forwardRef } from 'react'

const EventsTimelineWrapper = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(
	({ children }, ref) => {
		const organisations = useEvents().data?.organisations ?? []
		return (
			<div className="events-timeline w-full relative" ref={ref}>
				<style jsx global>{`
					.events-timeline:has(.legend-org:hover) .event-item {
						opacity: 0.1 !important;
					}
					${organisations
						.map((org) => {
							const slug = slugifyCssClass(org.name)
							return `
								.events-timeline:has(.legend-org-${slug}:hover)
									.event-item-org-${slug} {
										opacity: 1 !important;
									}
								`
						})
						.join('')}
				`}</style>
				{children}
			</div>
		)
	},
)

EventsTimelineWrapper.displayName = 'EventsTimelineWrapper'

export default EventsTimelineWrapper
