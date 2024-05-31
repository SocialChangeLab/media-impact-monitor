import EventPageContent from "@/components/EventPageContent";

export default async function EventPage({
	params: { id },
}: {
	params: { id: string };
}) {
	return <EventPageContent id={id} />;
}
