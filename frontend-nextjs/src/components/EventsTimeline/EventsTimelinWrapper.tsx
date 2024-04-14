import { PropsWithChildren } from 'react'

function EventsTimelineWrapper({ children }: PropsWithChildren<{}>) {
	return <div className="w-full overflow-x-auto">{children}</div>
}

export default EventsTimelineWrapper
