import { getEventData } from '@/utility/eventsUtil'
import { parseSearchParams } from '@/utility/searchParamsUtil'

export default async function EventPage({
	params,
	searchParams,
}: {
	params: { id: string }
	searchParams: Record<string, string>
}) {
	const parsedSearchParams = parseSearchParams(
		new URLSearchParams(searchParams),
	)
	const { data } = await getEventData(params.id, parsedSearchParams)
	if (!data) return
	return (
		<>
			<h1>{data.description}</h1>
		</>
	)
}
