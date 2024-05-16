import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import { queryClient } from "@/components/QueryClientProvider";
import { getEventsData } from "@/utility/eventsUtil";

async function TimelineRoute() {
	const { data, error } = await getEventsData();

	if (error) {
		console.error("Error loading events", error);
		throw new Error(error);
	}

	queryClient.setQueryData(["events"], data);
	return <EventsTimeline data={data} />;
}

export default TimelineRoute;
