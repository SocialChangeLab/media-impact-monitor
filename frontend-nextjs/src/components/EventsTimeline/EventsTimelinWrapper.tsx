import { PropsWithChildren, forwardRef } from 'react'

const EventsTimelineWrapper = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(
	({ children }, ref) => {
		return (
			<div className="w-full overflow-clip" ref={ref}>
				{children}
			</div>
		)
	},
)

EventsTimelineWrapper.displayName = 'EventsTimelineWrapper'

export default EventsTimelineWrapper
