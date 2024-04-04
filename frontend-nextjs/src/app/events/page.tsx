import { getEventsData } from '@utility/eventsUtil'
import EventsTable from './table'

export default async function EventsList() {
	const data = await getEventsData()
	return <EventsTable data={data} />
}
