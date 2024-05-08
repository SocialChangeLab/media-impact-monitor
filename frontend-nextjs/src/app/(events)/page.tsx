import { getEventsData } from '@/utility/eventsUtil'
import { parseSearchParams } from '@/utility/searchParamsUtil'
import { QueryClient } from '@tanstack/react-query'

export default function EventsPage({
	searchParams,
}: {
	searchParams: Record<string, string>
}) {
	const parsedSearchParams = parseSearchParams(
		new URLSearchParams(searchParams),
	)
	const queryClient = new QueryClient()
	const { from, to } = parsedSearchParams
	queryClient.prefetchQuery({
		queryKey: ['events', from?.toISOString(), to?.toISOString()],
		queryFn: () => getEventsData(parsedSearchParams),
	})
	return null
}
