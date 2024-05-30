import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

async function MediaSentimentRoute() {
	return (
		<SectionHeadlineWithExplanation
			headline="Media Sentiment of climate change in German newspapers"
			description="See the media sentiment of climate-related topics in germany over time"
			help="See the media sentiment of climate-related topics in germany over time"
		>
			<MediaSentimentChart />
		</SectionHeadlineWithExplanation>
	);
}

export default MediaSentimentRoute;
