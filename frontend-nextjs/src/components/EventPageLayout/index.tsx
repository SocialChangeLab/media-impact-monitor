import { defaultFrom, defaultTo } from '@app/(events)/config'
import { Button } from '@components/ui/button'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { PropsWithChildren, Suspense } from 'react'
import EventTimelineDatePicker from './EventTimelineDatePicker'

function EventPageLayout({ children }: PropsWithChildren<{}>) {
	return (
		<div className="px-6 pt-8 pb-16">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold font-headlines antialiased">
					{'Events'}
				</h1>

				<Suspense
					fallback={
						<Button variant="outline" className="text-grayDark">
							<CalendarDays className="mr-2 w-6 h-6" />
							<>
								{format(new Date(defaultFrom), 'LLL dd, y')} -{' '}
								{format(new Date(defaultTo), 'LLL dd, y')}
							</>
						</Button>
					}
				>
					<EventTimelineDatePicker />
				</Suspense>
			</div>
			<div className="flex flex-col gap-8">{children}</div>
		</div>
	)
}

export default EventPageLayout
