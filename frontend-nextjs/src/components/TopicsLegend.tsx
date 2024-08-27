import CollapsableSection from "@/components/CollapsableSection";
import DataCreditLegend from "@/components/DataCreditLegend";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { TrendQueryProps } from "@/utility/mediaTrendUtil";
import { titleCase } from "@/utility/textUtil";
import { getTopicIcon, topicIsSentiment } from "@/utility/topicsUtil";
import { memo } from "react";
import slugify from "slugify";
import {
	ImpactKeywordLabel,
	ImpactKeywordLabelTooltip,
	ImpactSentimentLabelTooltip,
	topicsMap,
} from "./ImpactChart/ImpactKeywordLabel";

function GenericTopicsLegend({
	id,
	topics,
	sources = [
		{
			label: "Media data",
			links: [
				{
					text: "MediaCloud",
					url: "https://mediacloud.org/",
				},
			],
		},
	],
}: {
	id: string;
	topics: {
		topic: string;
		color: string;
		sum?: number;
	}[];
	sources?: {
		label: string;
		links: { text: string; url: string }[];
	}[];
}) {
	return (
		<div
			className={cn(
				"pt-6 flex flex-col gap-y-2 gap-x-[max(2rem,4vmax)] sm:grid sm:grid-cols-[2fr_1fr]",
			)}
		>
			{topics.length > 0 ? (
				<CollapsableSection
					title="Legend"
					storageKey={`media-coverage-legend-${id}-expanded`}
					storageType="session"
				>
					<div className="flex flex-col gap-2">
						<ul className="flex flex-wrap gap-x-6 relative z-20">
							{topics.map(({ topic, color, sum }) => {
								const Icon = getTopicIcon(topic);
								const isSentiment = topicIsSentiment(topic);
								const topics = topicsMap.get(
									slugify(topic, { lower: true, strict: true }),
								);
								const keywordLabel = (
									<ImpactKeywordLabel label={titleCase(topic)} color={color} />
								);
								return (
									<li
										key={topic}
										className={cn(
											"grid grid-cols-[auto_1fr_auto] gap-x-1.5 py-2",
											"items-center",
											`legend-topic legend-topic-${slugifyCssClass(topic)}`,
											`cursor-pointer`,
										)}
									>
										<Icon
											color={color}
											className={cn("size-6 shrink-0 text-grayDark")}
										/>
										<span className="truncate flex gap-3 items-baseline">
											{isSentiment && (
												<ImpactSentimentLabelTooltip>
													{keywordLabel}
												</ImpactSentimentLabelTooltip>
											)}
											{topics && (
												<ImpactKeywordLabelTooltip
													unitLabel="articles"
													keywords={topics}
												>
													{keywordLabel}
												</ImpactKeywordLabelTooltip>
											)}
											{sum && (
												<span className="font-mono text-xs text-grayDark">
													({sum.toLocaleString("en-GB")})
												</span>
											)}
										</span>
									</li>
								);
							})}
						</ul>
					</div>
				</CollapsableSection>
			) : (
				<div />
			)}
			<DataCreditLegend
				storageKey={`media-coverage-data-credits-${id}-expanded`}
				sources={sources}
			/>
		</div>
	);
}

function TopicsLegend({
	sentiment_target,
	topics,
	trend_type,
}: {
	sentiment_target?: TrendQueryProps["sentiment_target"];
	topics?: { topic: string; color: string; sum: number }[];
	trend_type: TrendQueryProps["trend_type"];
}) {
	const sentimentTopics = [
		{ topic: "positive", color: "var(--sentiment-positive)" },
		{ topic: "neutral", color: "var(--sentiment-neutral)" },
		{ topic: "negative", color: "var(--sentiment-negative)" },
	];
	const keywordTopics = [
		{ topic: "climate policy", color: "var(--keyword-climate-policy)" },
		{ topic: "climate activism", color: "var(--keyword-climate-activism)" },
		{
			topic: "climate crisis framing",
			color: "var(--keyword-climate-crisis-framing)",
		},
		{ topic: "climate science", color: "var(--keyword-climate-science)" },
	];
	return (
		<GenericTopicsLegend
			topics={
				topics?.length && topics.length > 0
					? topics
					: trend_type === "keywords"
						? keywordTopics
						: sentimentTopics
			}
			id={`trend-with-impact-chart-${trend_type}-${sentiment_target || "none"}`}
		/>
	);
}

export default memo(TopicsLegend);
