import OrganisationPageContent from "@/components/OrganisationPageContent";
import { extractEventOrganisations, getEventsData, type EventOrganizerSlugType } from "@/utility/eventsUtil";
import { texts } from "@/utility/textUtil";
import { Metadata } from "next";

type Props = {
	params: { slug: string }
}

export async function generateMetadata(
	{ params }: Props,
): Promise<Metadata> {
	const slug = params.slug
	const fallbackTitle = `Organisation ${slug} | ${texts.seo.siteTitle}`
	try {
		const data = await getEventsData()
		const organisations = extractEventOrganisations(data)
		const org = organisations.find((x) => x.slug === slug);

		if (!org) return { title: fallbackTitle }
		return {
			title: `${org.name} | ${texts.seo.siteTitle}`,
		}
	} catch (error) {
		console.error(error)
		return {
			title: fallbackTitle
		}
	}
}

export default async function EventPage({
	params: { slug },
}: {
	params: { slug: EventOrganizerSlugType };
}) {
	return <OrganisationPageContent slug={slug} />;
}
