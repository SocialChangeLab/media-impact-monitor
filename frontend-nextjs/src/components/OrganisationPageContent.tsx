import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import OrganisationPageHeader from "./OrganisationPageHeader";

function OrganisationPageContent({ slug }: { slug: EventOrganizerSlugType }) {
	return (
		<>
			<OrganisationPageHeader slug={slug} />
			<SectionHeadlineWithExplanation
				headline="Media Timeline of Event"
				description="See the media sentiment of articles and media related to the organisation"
				helpSlug="sentimentTrend"
			>
				<MediaSentimentChart />
			</SectionHeadlineWithExplanation>
		</>
	);
}

export default OrganisationPageContent;
