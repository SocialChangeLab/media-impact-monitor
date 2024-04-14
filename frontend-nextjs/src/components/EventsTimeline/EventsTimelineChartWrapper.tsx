'use client'
import { PropsWithChildren } from 'react'
function EventsTimelineChartWrapper({ children }: PropsWithChildren<{}>) {
	return (
		<div
			key="events-timeline-chart-wrapper"
			className="flex gap-0.5 items-center py-6 justify-evenly min-w-full bg-grayUltraLight min-h-96"
		>
			{children}
		</div>
	)
}

export default EventsTimelineChartWrapper
