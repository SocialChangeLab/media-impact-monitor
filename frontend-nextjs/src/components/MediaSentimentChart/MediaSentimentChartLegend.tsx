import CollapsableSection from "@/components/CollapsableSection";
import DataCreditLegend from "@/components/DataCreditLegend";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { memo } from "react";

function MediaCoverageChartLegend({
	topics,
}: {
	topics: {
		topic: string;
		color: string;
		sum: number;
	}[];
}) {
	return (
		<div className="pt-6 flex gap-[max(2rem,4vmax)] sm:grid sm:grid-cols-[1fr_auto]">
			<CollapsableSection
				title="Legend"
				storageKey="media-coverage-legend-expanded"
			>
				<div className="flex flex-col gap-2">
					<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr));] gap-x-8 relative z-20">
						{topics.map(({ topic, color, sum }) => (
							<li
								key={topic}
								className={cn(
									"grid grid-cols-[auto_1fr_auto] gap-x-3 py-2",
									"items-center",
									`legend-topic legend-topic-${slugifyCssClass(topic)}`,
									`cursor-pointer`,
								)}
							>
								<span
									className={cn(
										"size-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
									)}
									style={{ backgroundColor: color }}
									aria-hidden="true"
								/>
								<span className="truncate flex gap-4 items-baseline">
									{`${topic.charAt(0).toUpperCase()}${topic.slice(1)}`}
									<span className="font-mono text-xs text-grayDark">
										({sum.toLocaleString("en-GB")})
									</span>
								</span>
							</li>
						))}
					</ul>
				</div>
			</CollapsableSection>
			<DataCreditLegend
				storageKey="media-coverage-data-credits-expanded"
				sources={[
					{
						label: "Media data",
						links: [
							{
								text: "MediaCloud",
								url: "https://mediacloud.org/",
							},
						],
					},
				]}
			/>
		</div>
	);
}

export default memo(MediaCoverageChartLegend);
