import { getEventData } from "@/utility/eventsUtil";
import { notFound } from "next/navigation";

export default async function EventPage({
	params,
}: {
	params: { id: string };
}) {
	const data = await getEventData(params.id);

	if (!data) return notFound();

	return (
		<>
			<h1>{data.description}</h1>
		</>
	);
}
