import DashboardHelpBanner from "@/components/DashboardHelpBanner.server";
import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import MediaCoverageChart from "@/components/MediaCoverageChart";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import NewsletterFooterSection from "@/components/NewsletterFooterSection";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import SizeOptimizationNotice from "@/components/SizeOptimizationNotice.server";
import TrendWithImpactChartWrapper from "@/components/TrendWithImpactChartWrapper";

export default function EventsPageWithSuspense() {
	return (
		<>
			<SizeOptimizationNotice />
			<DashboardHelpBanner />
			<SectionHeadlineWithExplanation
				headline="What protests are happening?"
				description={
					<>
						<p className="text-pretty">
							See protests over time for each of the selected organisations.
						</p>
						<p className="text-pretty">
							Hover and click on the bubbles for more information on the
							individual protest events.
						</p>
						<p className="text-pretty">
							Currently, we cover only climate protests in Germany.
						</p>
					</>
				}
			>
				<EventsTimeline />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="What topics are the focus of public discourse?"
				description={
					<>
						<p className="text-pretty">
							See how many articles are published on various topics over time.
						</p>
						<p className="text-pretty">
							Use the filters to switch between online newspaper articles, print
							newspaper articles, and queries that people search for on Google.
						</p>
					</>
				}
				helpSlug="mediaTrend"
			>
				<TrendWithImpactChartWrapper trend_type="keywords">
					<MediaCoverageChart />
				</TrendWithImpactChartWrapper>
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="What sentiment does the media have towards the protests?"
				description="See whether the media's coverage of the protests is positive, negative, or neutral."
				helpSlug="sentimentTrend"
			>
				<TrendWithImpactChartWrapper
					trend_type="sentiment"
					sentiment_target="activism"
				>
					<MediaSentimentChart sentiment_target="activism" />
				</TrendWithImpactChartWrapper>
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="What stance does the media have towards progressive climate policies?"
				description="See whether the media supports or opposes policies aimed at mitigating climate change."
				helpSlug="sentimentTrend"
			>
				<TrendWithImpactChartWrapper
					trend_type="sentiment"
					sentiment_target="policy"
				>
					<MediaSentimentChart sentiment_target="policy" />
				</TrendWithImpactChartWrapper>
			</SectionHeadlineWithExplanation>
			<NewsletterFooterSection />
		</>
	);
}
