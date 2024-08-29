import OrganisationPageContent from "@/components/OrganisationPageContent";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";

export default async function EventPage({
	params: { slug },
}: {
	params: { slug: EventOrganizerSlugType };
}) {
	return <OrganisationPageContent slug={slug} />;
}
