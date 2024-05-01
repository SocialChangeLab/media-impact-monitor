import LoadingEventsTimeline from '@components/EventsTimeline/LoadingEventsTimeline'

export default function EventPageLoadng() {
	return (
		<>
			<div className="flex flex-col gap-4">
				<LoadingEventsTimeline />
			</div>
			<div className="flex flex-col gap-4 pt-8">
				<div className="w-full flex justify-center min-h-96 p-8 items-center bg-grayUltraLight">
					Loading...
				</div>
			</div>
		</>
	)
}
