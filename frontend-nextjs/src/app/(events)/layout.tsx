'use client'
import EventPageLayout from '@components/EventPageLayout'
import { ReactNode, Suspense } from 'react'

export default function EventPage({ children }: { children: ReactNode }) {
	return (
		<Suspense>
			<EventPageLayout>{children}</EventPageLayout>
		</Suspense>
	)
}
