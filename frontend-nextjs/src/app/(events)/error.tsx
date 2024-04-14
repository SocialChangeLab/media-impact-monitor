'use client'
import ComponentError from '@components/ComponentError'
import ErrorEventsTimeline from '@components/EventsTimeline/ErrorEventsTimeline'

export default function EventPageError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<>
			<div className="flex flex-col gap-4">
				<ErrorEventsTimeline errorMessage={error.message} reset={reset} />
			</div>
			<div className="flex flex-col gap-4 pt-8">
				<div className="w-full flex justify-center min-h-96 p-8 items-center bg-grayUltraLight">
					<ComponentError
						errorMessage={error.message}
						reset={reset}
						announcement="There was an error loading events"
					/>
				</div>
			</div>
		</>
	)
}
