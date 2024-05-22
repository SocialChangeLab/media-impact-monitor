import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import { getEventsData } from "@/utility/eventsUtil";
import { parseSearchParamsFilters } from "@/utility/searchParamsUtil";

async function TimelineRoute({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const { from, to } = parseSearchParamsFilters(searchParams);
	const data = await getEventsData(from && to ? { from, to } : undefined);

	return <EventsTimeline data={data} />;
}

export default TimelineRoute;
