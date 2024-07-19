"use client";
import OrganisationPageContent from "@/components/OrganisationPageContent";
import { SlideUpDrawer } from "@/components/SlideUpDrawer";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";

function InderceptedEventPage({
	params: { slug },
}: {
	params: { slug: EventOrganizerSlugType };
}) {
	return (
		<SlideUpDrawer id={slug} basePath="/organisations/">
			<OrganisationPageContent slug={slug} />
			<div className="boost-header-above-dialog" aria-hidden="true" />
		</SlideUpDrawer>
	);
}

export default InderceptedEventPage;
