"use client";
import EventPageContent from "@/components/EventPageContent";
import { SlideUpDrawer } from "@/components/SlideUpDrawer";

function InderceptedEventPage({
	params: { id },
}: {
	params: { id: string };
}) {
	return (
		<SlideUpDrawer id={id} basePath="/events/">
			<EventPageContent id={id} />
			<div className="boost-header-above-dialog" aria-hidden="true" />
		</SlideUpDrawer>
	);
}

export default InderceptedEventPage;
