"use client";
import OrganisationPageContent from "@/components/OrganisationPageContent";
import { ResponsiveModal } from "@/components/ui/responsive-dialog";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";

function InderceptedEventPage({
	params: { slug },
}: {
	params: { slug: EventOrganizerSlugType };
}) {
	return (
		<ResponsiveModal id={slug} basePath="/organisations/">
			<OrganisationPageContent slug={slug} />
		</ResponsiveModal>
	);
}

export default InderceptedEventPage;
