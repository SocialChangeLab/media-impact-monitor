import type { EventOrganizerSlugType } from '@/utility/eventsUtil'
import OrganisationPageAdBanner from './OrganisationPageAdBanner'
import OrganisationPageHeader from './OrganisationPageHeader'

function OrganisationPageContent({ slug }: { slug: EventOrganizerSlugType }) {
	return (
		<>
			<OrganisationPageHeader slug={slug} />
			<OrganisationPageAdBanner slug={slug} />
		</>
	)
}

export default OrganisationPageContent
