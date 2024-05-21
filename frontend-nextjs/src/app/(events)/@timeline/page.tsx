import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import { getEventsData } from "@/utility/eventsUtil";
import { z } from "zod";

const stringDateZodSchema = z.coerce.date().optional();

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

function parseSearchParamsFilters(searchParams?: {
	[key: string]: string | string[] | undefined;
}) {
	if (
		!searchParams ||
		!("filters" in searchParams) ||
		typeof searchParams.filters !== "string"
	)
		return { from: undefined, to: undefined };
	try {
		const parsed = JSON.parse(JSON.parse(searchParams.filters));
		return z
			.object({ from: stringDateZodSchema, to: stringDateZodSchema })
			.parse(parsed.state);
	} catch (error) {
		return { from: undefined, to: undefined };
	}
}
