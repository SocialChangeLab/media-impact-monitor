import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import { getEventsData } from "@/utility/eventsUtil";
import { z } from "zod";

const stringDateZodSchema = z.coerce.date().optional();

async function TimelineRoute({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const from = stringDateZodSchema.safeParse(searchParams?.from)?.data;
	const to = stringDateZodSchema.safeParse(searchParams?.to)?.data;
	const { data, error } = await getEventsData(
		from && to ? { from, to } : undefined,
	);

	if (error) {
		console.error("Error loading events", error);
		throw new Error(error);
	}

	return <EventsTimeline data={data} />;
}

export default TimelineRoute;
