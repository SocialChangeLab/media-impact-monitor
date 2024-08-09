import CollapsableSection from "@/components/CollapsableSection";
import DataCreditLegend from "@/components/DataCreditLegend";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { titleCase } from "@/utility/textUtil";
import { getTopicIcon, topicIsSentiment } from "@/utility/topicsUtil";
import { memo } from "react";
import {
	ImpactKeywordLabel,
	ImpactKeywordLabelTooltip,
} from "./ImpactChart/ImpactKeywordLabel";

function TopicsLegend({
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
		sum: number;
	}[];
	sources?: {
		label: string;
		links: { text: string; url: string }[];
	}[];
}) {
	return (
		<div className="pt-6 flex gap-[max(2rem,4vmax)] sm:grid sm:grid-cols-[2fr_1fr]">
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
							return (
								<li
									key={topic}
									className={cn(
										"grid grid-cols-[auto_1fr_auto] gap-x-3 py-2",
										"items-center",
										`legend-topic legend-topic-${slugifyCssClass(topic)}`,
										`cursor-pointer`,
									)}
								>
									<Icon
										color={color}
										className={cn("size-6 shrink-0 text-grayDark")}
									/>
									<span className="truncate flex gap-4 items-baseline">
										{isSentiment && titleCase(topic)}
										{!isSentiment && (
											<ImpactKeywordLabelTooltip
												unitLabel="articles"
												keywords={undefined}
											>
												{/* TODO: Add real keywords */}
												<ImpactKeywordLabel label={topic} color={color} />
											</ImpactKeywordLabelTooltip>
										)}
										<span className="font-mono text-xs text-grayDark">
											({sum.toLocaleString("en-GB")})
										</span>
									</span>
								</li>
							);
						})}
					</ul>
				</div>
			</CollapsableSection>
			<DataCreditLegend
				storageKey={`media-coverage-data-credits-${id}-expanded`}
				sources={sources}
			/>
		</div>
	);
}

export default memo(TopicsLegend);
