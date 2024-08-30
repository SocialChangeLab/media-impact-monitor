import DashboardHelpBanner from "@/components/DashboardHelpBanner.server";
import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import MediaCoverageChart from "@/components/MediaCoverageChart";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import NewsletterFooterSection from "@/components/NewsletterFooterSection";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import SizeOptimizationNotice from "@/components/SizeOptimizationNotice.server";
import TrendWithImpactChartWrapper from "@/components/TrendWithImpactChartWrapper";
import { texts } from "@/utility/textUtil";

export const metadata = {
	title: `${texts.mainNavigation.dashboard} | ${texts.seo.siteTitle}`,
}

export default function EventsPageWithSuspense() {
	return (
		<>
			<SizeOptimizationNotice />
			<DashboardHelpBanner />
			<SectionHeadlineWithExplanation
				headline={texts.charts.protest_timeline.heading}
				helpSlug="protest_timeline"
				description={texts.charts.protest_timeline.description.map(
					(desc, i) => (
						<p
							key={`${desc}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
								}`}
							className="text-pretty"
						>
							{desc}
						</p>
					),
				)}
			>
				<EventsTimeline />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline={texts.charts.topics_trend.heading}
				description={texts.charts.topics_trend.description.map((desc, i) => (
					<p
						key={`${desc}-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
							}`}
						className="text-pretty"
					>
						{desc}
					</p>
				))}
				helpSlug="topics-trend"
			>
				<TrendWithImpactChartWrapper
					trend_type="keywords"
					impactHeadline={texts.charts.topics_impact.heading}
					impactDescription={texts.charts.topics_impact.description}
					impactHelpSlug="topics-impact"
					sources={texts.charts.topics_trend.data_credit}
				>
					<MediaCoverageChart />
				</TrendWithImpactChartWrapper>
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline={texts.charts.sentiment_protest.heading}
				description={texts.charts.sentiment_protest.description.map(
					(desc, i) => (
						<p
							key={`${desc}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
								}`}
							className="text-pretty"
						>
							{desc}
						</p>
					),
				)}
				helpSlug="sentiment-trends"
			>
				<TrendWithImpactChartWrapper
					trend_type="sentiment"
					sentiment_target="activism"
					impactHeadline={texts.charts.sentiment_protest_impact.heading}
					impactDescription={texts.charts.sentiment_protest_impact.description}
					impactHelpSlug="sentiment-impact"
					sources={texts.charts.sentiment_protest.data_credit}
				>
					<MediaSentimentChart sentiment_target="activism" />
				</TrendWithImpactChartWrapper>
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline={texts.charts.sentiment_policy.heading}
				description={texts.charts.sentiment_policy.description.map(
					(desc, i) => (
						<p
							key={`${desc}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
								}`}
							className="text-pretty"
						>
							{desc}
						</p>
					),
				)}
				helpSlug="sentiment-trends"
			>
				<TrendWithImpactChartWrapper
					trend_type="sentiment"
					sentiment_target="policy"
					impactHeadline={texts.charts.sentiment_policy_impact.heading}
					impactDescription={texts.charts.sentiment_policy_impact.description}
					impactHelpSlug="sentiment-impact"
					sources={texts.charts.sentiment_policy.data_credit}
				>
					<MediaSentimentChart sentiment_target="policy" />
				</TrendWithImpactChartWrapper>
			</SectionHeadlineWithExplanation>
			<NewsletterFooterSection />
		</>
	);
}
