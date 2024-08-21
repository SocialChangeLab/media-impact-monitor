import EventPageHeader from "@/components/EventPageHeader";
import FullTextsSentimentChart from "@/components/FullTextsSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import EventMediaTable from "./EventMediaTable";
import HeadlineWithLine from "./HeadlineWithLine";

function EventPageContent({ id }: { id: string }) {
	return (
		<>
			<EventPageHeader id={id} />
			<SectionHeadlineWithExplanation
				headline="Protest Timeline of Sentiment"
				description="See the sentiment towards activism of articles related to the protest"
				helpSlug="sentimentTrend"
			>
				<div className="flex flex-col gap-x-8 gap-y-6 xl:grid xl:grid-cols-2">
					<div className="flex flex-col gap-4">
						<HeadlineWithLine>Sentiment towards Activism</HeadlineWithLine>
						<FullTextsSentimentChart
							sentiment_target="activism"
							event_id={id}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<HeadlineWithLine>Sentiment towards Policy</HeadlineWithLine>
						<FullTextsSentimentChart
							sentiment_target="activism"
							event_id={id}
						/>
					</div>
				</div>
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
