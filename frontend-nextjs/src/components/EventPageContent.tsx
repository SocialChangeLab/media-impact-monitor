import EventPageHeader from "@/components/EventPageHeader";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import EventMediaTable from "./EventMediaTable";

function EventPageContent({ id }: { id: string }) {
	return (
		<>
			<EventPageHeader id={id} />
			<SectionHeadlineWithExplanation
				headline="Media Timeline of Event"
				description="See the media sentiment of articles and media related to the event"
				helpSlug="sentimentTrend"
			>
				<MediaSentimentChart sentiment_target="activism" />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="Event Media Mentions"
				description="See which articles and media mention the event"
				helpSlug="mediaMentions"
			>
				<EventMediaTable id={id} />
			</SectionHeadlineWithExplanation>
		</>
	);
}

export default EventPageContent;
