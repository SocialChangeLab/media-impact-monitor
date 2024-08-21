import EventPageHeader from "@/components/EventPageHeader";
import FullTextsSentimentChart from "@/components/FullTextsSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { getTopicIcon } from "@/utility/topicsUtil";
import EventMediaTable from "./EventMediaTable";
import HeadlineWithLine from "./HeadlineWithLine";
import {
	ImpactKeywordLabel,
	ImpactKeywordLabelTooltip,
	topicsMap,
} from "./ImpactChart/ImpactKeywordLabel";

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
			Sentiment towards{" "}
			<span className="inline-flex gap-1 items-baseline">
				<Icon color={color} className="translate-y-1.5" />
				<ImpactKeywordLabelTooltip
					unitLabel="articles"
					keywords={topicsMap.get(topic)}
				>
					<ImpactKeywordLabel label={label} color={color} />
				</ImpactKeywordLabelTooltip>
			</span>
		</HeadlineWithLine>
	);
}

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
