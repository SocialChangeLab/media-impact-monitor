import EventPageContent from "@/components/EventPageContent";
import { format } from "@/utility/dateUtil";
import { getEventData } from "@/utility/eventsUtil";
import { texts } from "@/utility/textUtil";
import type { Metadata } from 'next';

type Props = {
	params: Promise<{ id: string }>
}

export async function generateMetadata(
	{ params }: Props,
): Promise<Metadata> {
	try {
		const { id } = await params
		const event = await getEventData(id)

		if (!event) return {}
		return {
			title: `${texts.singleProtestPage.heading({
				formattedDate: format(event.date, "LLLL do, yyyy"),
				orgName: event?.organizers[0]?.name,
				orgsCount: event?.organizers.length,
			})}`
		}
	} catch (error) {
		console.error(error)
		return {}
	}
}

export default async function EventPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <EventPageContent id={id} />;
}
