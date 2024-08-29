import EventPageHeader from "@/components/EventPageHeader";
import FullTextsSentimentChart from "@/components/FullTextsSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { texts, titleCase } from "@/utility/textUtil";
import { getTopicIcon } from "@/utility/topicsUtil";
import EventMediaTable from "./EventMediaTable";
import HeadlineWithLine from "./HeadlineWithLine";
import {
	ImpactKeywordLabel,
	ImpactKeywordLabelTooltip,
	topicsMap,
} from "./ImpactChart/ImpactKeywordLabel";
import TopicsLegend from "./TopicsLegend";

function TrendHeadline({
	topic,
	label,
}: {
	topic: "climate-activism" | "climate-policy";
	label: string;
}) {
	const Icon = getTopicIcon(topic);
	const color = `var(--keyword-${topic})`;
	return (
		<HeadlineWithLine>
			{texts.singleProtestPage.charts.sentimentTowards({
				topicNode: (
					<span className="inline-flex gap-1 items-baseline">
						<Icon color={color} className="translate-y-1.5" />
						<ImpactKeywordLabelTooltip
							unitLabel="articles"
							keywords={topicsMap.get(topic)}
						>
							<ImpactKeywordLabel
								label={
									texts.charts.topics[
										topic
											.toLowerCase()
											.replaceAll("-", " ") as keyof typeof texts.charts.topics
									] ?? titleCase(topic)
								}
								slug={label}
								color={color}
							/>
						</ImpactKeywordLabelTooltip>
					</span>
				),
			})}
		</HeadlineWithLine>
	);
}

function EventPageContent({ id }: { id: string }) {
	return (
		<>
			<EventPageHeader id={id} />
			<SectionHeadlineWithExplanation
				headline={texts.singleProtestPage.table.heading}
				description={texts.singleProtestPage.table.description}
				helpSlug="mediaMentions"
			>
				<EventMediaTable id={id} />
			</SectionHeadlineWithExplanation>
			<SectionHeadlineWithExplanation
				headline={texts.singleProtestPage.charts.heading}
				description={texts.singleProtestPage.charts.description}
				helpSlug="sentimentTrend"
			>
				<div className="flex flex-col gap-x-8 gap-y-6 xl:grid xl:grid-cols-2">
					<div className="flex flex-col gap-4">
						<TrendHeadline topic="climate-activism" label="Activism" />
						<FullTextsSentimentChart
							sentiment_target="activism"
							event_id={id}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<TrendHeadline topic="climate-policy" label="Policy" />
						<FullTextsSentimentChart
							sentiment_target="activism"
							event_id={id}
						/>
					</div>
				</div>
				<TopicsLegend
					trend_type="sentiment"
					sources={texts.charts.sentiment_protest.data_credit}
				/>
			</SectionHeadlineWithExplanation>
		</>
	);
}

export default EventPageContent;
