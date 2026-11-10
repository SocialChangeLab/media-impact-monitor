"use client";
import { use } from "react";
import EventPageContent from "@/components/EventPageContent";
import { SlideUpDrawer } from "@/components/SlideUpDrawer";

function InderceptedEventPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	return (
		<SlideUpDrawer id={id} basePath="/events/">
			<EventPageContent id={id} />
			<div className="boost-header-above-dialog" aria-hidden="true" />
		</SlideUpDrawer>
	);
}

export default InderceptedEventPage;
