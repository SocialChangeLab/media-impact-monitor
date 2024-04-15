import EventPageLayout from '@components/EventPageLayout'
import { PropsWithChildren, ReactNode, Suspense } from 'react'
import EventsTablePageLoadng from './@table/loading'
import EventsTimelinePageLoadng from './@timeline/loading'

export default function EventsPageLayout({
	timeline,
	table,
}: PropsWithChildren<{
	timeline: ReactNode
	table: ReactNode
}>) {
	return (
		<Suspense>
			<EventPageLayout>
				<div className="flex flex-col gap-4">
					<Suspense fallback={<EventsTimelinePageLoadng />}>
						{timeline}
					</Suspense>
				</div>
				<div className="flex flex-col gap-4 pt-8">
					<Suspense fallback={<EventsTablePageLoadng />}>{table}</Suspense>
				</div>
			</EventPageLayout>
		</Suspense>
	)
}
