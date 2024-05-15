import { getEventsData } from "@/utility/eventsUtil";
import { parseSearchParams } from "@/utility/searchParamsUtil";
import { QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function EventsPage({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	const parsedSearchParams = parseSearchParams(
		new URLSearchParams(searchParams),
	);
	const queryClient = new QueryClient();
	const { from, to } = parsedSearchParams;
	const formattedFrom = from && format(from, "yyyy-MM-dd");
	const formattedTo = to && format(to, "yyyy-MM-dd");
	queryClient.prefetchQuery({
		queryKey: ["events", formattedFrom, formattedTo],
		queryFn: () => getEventsData(parsedSearchParams),
	});
	return null;
}
