import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { titleCase } from "@/utility/textUtil";
import { topicIsSentiment } from "@/utility/topicsUtil";
import { type ReactNode, memo } from "react";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ImpactKeywordLabel = memo(
	({ label, color }: { label: string; color: string }) => {
		const isSentiment = topicIsSentiment(label);
		return (
			<span
				className={cn(
					"font-semibold underline underline-offset-2 decoration-2 text-fg",
					`legend-topic legend-topic-${slugifyCssClass(label)}`,
				)}
				style={{ textDecorationColor: color }}
			>
				{isSentiment ? label : titleCase(label)}
			</span>
		);
	},
);

export const ImpactKeywordLabelTooltip = memo(
	({
		children,
		unitLabel,
		keywords = [
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
			"TODO",
		],
	}: {
		children: ReactNode;
		unitLabel: string;
		keywords: string[] | undefined;
	}) => {
		return (
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<Portal>
					<TooltipContent>
						<p className="mt-3 mb-2 w-96">
							The category {children} encompasses {unitLabel} including one or
							more of the following {keywords.length} keywords:
						</p>
						<ul className="flex flex-wrap w-96 max-w-full gap-1 mb-2">
							{keywords.sort().map((keyword) => (
								<li
									key={keyword}
									className={cn(
										"inline-flex px-1.5 py-0.5 border border-grayMed",
										"bg-bg items-center",
									)}
								>
									<span className="truncate">{keyword}</span>
								</li>
							))}
						</ul>
					</TooltipContent>
				</Portal>
			</Tooltip>
		);
	},
);
