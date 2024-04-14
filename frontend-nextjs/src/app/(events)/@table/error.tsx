'use client'
import ComponentError from '@components/ComponentError'

export default function EventsTablePageError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className="w-full flex justify-center min-h-96 p-8 items-center bg-grayUltraLight">
			<ComponentError
				errorMessage={error.message}
				reset={reset}
				announcement="There was an error loading events"
			/>
		</div>
	)
}
