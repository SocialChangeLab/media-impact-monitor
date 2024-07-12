import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import OrganisationPageHeader from "./OrganisationPageHeader";

function OrganisationPageContent({ slug }: { slug: EventOrganizerSlugType }) {
	return (
		<>
			<OrganisationPageHeader slug={slug} />
		</>
	);
}

export default OrganisationPageContent;
