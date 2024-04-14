'use client'
import EventPageLayout from '@components/EventPageLayout'
import { PropsWithChildren, ReactNode, Suspense } from 'react'

export default function EventsPageLayout({
	children,
	timeline,
	table,
}: PropsWithChildren<{
	timeline: ReactNode
	table: ReactNode
}>) {
	return (
		<Suspense>
			<EventPageLayout>
				<div className="flex flex-col gap-4">{timeline}</div>
				<div className="flex flex-col gap-4 pt-8">{table}</div>
			</EventPageLayout>
		</Suspense>
	)
}
