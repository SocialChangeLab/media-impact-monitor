import { PropsWithChildren } from 'react'

function EventsTimelineWrapper({ children }: PropsWithChildren<{}>) {
	return <div className="w-full overflow-clip">{children}</div>
}

export default EventsTimelineWrapper
