import { getEventData } from "@/utility/eventsUtil";
import { notFound } from "next/navigation";

export default async function EventPage({
	params,
}: {
	params: { id: string };
}) {
	const { data, error } = await getEventData(params.id);

	if (error) throw new Error(error);
	if (!data) return notFound();

	return (
		<>
			<h1>{data.description}</h1>
		</>
	);
}
