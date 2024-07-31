import DashboardHelpBanner from "@/components/DashboardHelpBanner.server";
import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import ImpactChartWithData from "@/components/ImpactChart";
import MediaCoverageChartWithData from "@/components/MediaCoverageChart";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

export default function EventsPageWithSuspense() {
	return (
		<>
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
				<MediaCoverageChartWithData />
			</SectionHeadlineWithExplanation>
			{/* Maybe the impact section below can also be integrated with the above section */}
			<SectionHeadlineWithExplanation
				headline="How do the protests influence the topic focus?"
				description={
					<>
						<p className="text-pretty">
							See how the protests bring more (or less) focus on the issues that
							they advocate for, and compare how different organizations have
							different impacts on public discourse.
						</p>
						<p className="text-pretty">
							For this chart we connect the protest data and the media data from
							above, and compute impact statistics.
						</p>
					</>
				}
				helpSlug="mediaTrend"
			>
				<ImpactChartWithData />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="What sentiment does the media have towards the protests?"
				description="See whether the media's coverage of the protests is positive, negative, or neutral."
				helpSlug="sentimentTrend"
			>
				<MediaSentimentChart />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline="What stance does the media have towards progressive climate policies?"
				description="See whether the media supports or opposes policies aimed at mitigating climate change."
				helpSlug="sentimentTrend"
			>
				<MediaSentimentChart />
				{/* <ImpactChartWithData /> */}
			</SectionHeadlineWithExplanation>
		</>
	);
}
