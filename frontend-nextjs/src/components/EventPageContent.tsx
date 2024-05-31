import EventPageHeader from "@/components/EventPageHeader";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

function EventPageContent({ id }: { id: string }) {
	return (
		<>
			<EventPageHeader id={id} />
			<SectionHeadlineWithExplanation
				headline="Media Timeline of Event"
				description="See the media sentiment of articles and media related to the event"
				help="See the media sentiment of articles and media related to the event"
			>
				<MediaSentimentChart />
			</SectionHeadlineWithExplanation>
		</>
	);
}

export default EventPageContent;
