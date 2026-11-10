"use client";
import { use } from "react";
import OrganisationPageContent from "@/components/OrganisationPageContent";
import { SlideUpDrawer } from "@/components/SlideUpDrawer";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";

function InderceptedEventPage({
	params,
}: {
	params: Promise<{ slug: EventOrganizerSlugType }>;
}) {
	const { slug } = use(params);
	return (
		<SlideUpDrawer id={slug} basePath="/organisations/">
			<OrganisationPageContent slug={slug} />
			<div className="boost-header-above-dialog" aria-hidden="true" />
		</SlideUpDrawer>
	);
}

export default InderceptedEventPage;
