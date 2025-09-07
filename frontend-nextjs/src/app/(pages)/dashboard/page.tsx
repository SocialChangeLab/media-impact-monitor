import DashboardHelpBanner from '@/components/DashboardHelpBanner.server'
import EventsTimeline from '@/components/EventsTimeline/EventsTimeline'
import MediaCoverageChart from '@/components/MediaCoverageChart'
import MediaSentimentChart from '@/components/MediaSentimentChart'
import NewsletterFooterSection from '@/components/NewsletterFooterSection'
import SectionHeadlineWithExplanation from '@/components/SectionHeadlineWithExplanation'
import SizeOptimizationNoticeServer from '@/components/SizeOptimizationNotice.server'
import TrendWithImpactChartWrapper from '@/components/TrendWithImpactChartWrapper'
import TopicAwareDashboard from '@/components/TopicAwareDashboard'
import { texts } from '@/utility/textUtil'

export const metadata = {
	title: `${texts.mainNavigation.dashboard} | ${texts.seo.siteTitle}`,
}

export default function EventsPageWithSuspense() {
	return (
		<>
			<SizeOptimizationNoticeServer />
			<DashboardHelpBanner />
			<TopicAwareDashboard />
			<NewsletterFooterSection showScreenshot={false} />
		</>
	)
}
