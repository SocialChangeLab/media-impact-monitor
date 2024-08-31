import OrganisationsOverviewPageContent from "@/components/OrganisationsOverviewPageContent";
import { texts } from "@/utility/textUtil";

export const metadata = {
	title: `${texts.mainNavigation.organisations} | ${texts.seo.siteTitle}`,
}

export default function OrganisationsOverviewPage() {
	return (
		<OrganisationsOverviewPageContent />
	);
}
