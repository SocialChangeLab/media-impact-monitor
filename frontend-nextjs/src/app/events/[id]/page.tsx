import { getEventData } from '@utility/eventsUtil'

export default async function EventPage({
	params,
}: {
	params: { id: string }
}) {
	const { data } = await getEventData(params.id)
	if (!data) return
	return (
		<>
			<h1>{data.description}</h1>
		</>
	)
}
