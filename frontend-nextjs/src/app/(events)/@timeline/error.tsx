'use client'
import ErrorEventsTimeline from '@/components/EventsTimeline/ErrorEventsTimeline'

export default function EventsTimelinePageError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return <ErrorEventsTimeline errorMessage={error.message} reset={reset} />
}
