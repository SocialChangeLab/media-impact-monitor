import DashboardHelpBanner from "@/components/DashboardHelpBanner";
import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
// import ImpactChartWithData from "@/components/ImpactChart";
import MediaCoverageChartWithData from "@/components/MediaCoverageChart";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

export default function EventsPageWithSuspense() {
	return (
		<>
			<DashboardHelpBanner />
			<SectionHeadlineWithExplanation
				headline="Protest Timeline"
				description="See protests over time for each of the selected organisations"
				helpSlug="protestTimeline"
			>
				<EventsTimeline />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="Coverage of climate change in German newspapers"
				description="See the media coverage of climate-related topics in germany over time"
				helpSlug="mediaTrend"
			>
				<MediaCoverageChartWithData />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="Media Sentiment of climate change in German newspapers"
				description="See the media sentiment of climate-related topics in germany over time"
				helpSlug="sentimentTrend"
			>
				<MediaSentimentChart />
				{/* <ImpactChartWithData /> */}
			</SectionHeadlineWithExplanation>
		</>
	);
}
