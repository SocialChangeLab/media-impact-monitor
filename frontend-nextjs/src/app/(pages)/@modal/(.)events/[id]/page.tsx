"use client";
import EventPageContent from "@/components/EventPageContent";
import { ResponsiveModal } from "@/components/ui/responsive-dialog";

function InderceptedEventPage({
	params: { id },
}: {
	params: { id: string };
}) {
	return (
		<ResponsiveModal id={id} basePath="/events/">
			<EventPageContent id={id} />
		</ResponsiveModal>
	);
}

export default InderceptedEventPage;
