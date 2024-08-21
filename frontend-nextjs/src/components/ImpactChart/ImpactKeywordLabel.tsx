import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { titleCase } from "@/utility/textUtil";
import { topicIsSentiment } from "@/utility/topicsUtil";
import Link from "next/link";
import { type ReactNode, memo } from "react";
import slugify from "slugify";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ImpactKeywordLabel = memo(
	({
		label,
		color,
		className,
	}: { label: string; color: string; className?: string }) => {
		const isSentiment = topicIsSentiment(label);
		return (
			<span
				className={cn(
					"font-semibold underline underline-offset-2 decoration-2 text-fg",
					`legend-topic legend-topic-${slugifyCssClass(label)}`,
					className,
				)}
				style={{ textDecorationColor: color, color }}
			>
				<span className="[&:not(:hover)]:text-fg transition">
					{titleCase(label)}
				</span>
			</span>
		);
	},
);

export const topicsMap = new Map<string, string[][]>(
	Object.entries({
		[slugify("Climate Science", { lower: true, strict: true })]: [
			["klimaforsch*", "klimawissenschaft*", "erderwärmung", "ipcc"],
		],
		[slugify("Climate Policy", { lower: true, strict: true })]: [
			[
				"klimapoliti*",
				"klimaneutral*",
				"klimaziel*",
				"klimaschutzpaket",
				"klimaschutzgesetz",
				"klimaschutzmaßnahmen",
				"klimaschutzabkommen",
				"klimaschutzprogramm",
				"kohleausstieg",
				"erneuerbare energie*",
				"bürgerrat",
				"gesellschaftsrat",
				"tempolimit",
				"tempo 100",
				"9-euro-ticket",
				"neun-euro-ticket",
				"vergesellschaftung",
				"schuldenschnitt",
				"klimagerechtigkeit",
			],
		],
		[slugify("Climate Crisis Framing", { lower: true, strict: true })]: [
			[
				"klimakrise",
				"klimakatastrophe",
				"klimakollaps",
				"klimanotstand",
				"klimagerechtigkeit",
			],
		],
		[slugify("Climate Activism", { lower: true, strict: true })]: [
			[
				"*protest*",
				"*demo",
				"*demonstr*",
				"*kundgebung",
				"versamm*",
				"*besetz*",
				"*streik*",
				"*blockade",
				"*blockier*",
				"sitzblock*",
				"*aktivis*",
				"*marsch",
				"*parade",
				"mahnwache",
				"hungerstreik",
				"ziviler ungehorsam",
			],
			["klimawandel", "klimaerwärmung", "erderwärmung", "klimaschutz"],
		],
	}),
);

export const ImpactKeywordLabelTooltip = memo(
	({
		children,
		unitLabel,
		keywords,
	}: {
		children: ReactNode;
		unitLabel: string;
		keywords: string[][] | undefined;
	}) => {
		if (!keywords || keywords.length === 0) return <>{children}</>;
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
							{keywords.reduce((acc, keywordList) => {
								const keywords = keywordList.map((keyword) => (
									<li
										key={keyword}
										className={cn(
											"inline-flex px-1.5 py-0.5 border border-grayMed",
											"bg-bg items-center",
										)}
									>
										<span className="truncate">{keyword}</span>
									</li>
								));
								if (acc.length === 0) return keywords;
								acc.push(
									<p key="OR" className="mt-3 mb-2 w-96">
										And one or more of the following keywords:
									</p>,
								);
								return acc.concat(keywords);
							}, [] as ReactNode[])}
						</ul>
					</TooltipContent>
				</Portal>
			</Tooltip>
		);
	},
);

export const ImpactSentimentLabelTooltip = memo(
	({
		children,
	}: {
		children: ReactNode;
	}) => {
		return (
			<Tooltip>
				<TooltipTrigger className="group">{children}</TooltipTrigger>
				<Portal>
					<TooltipContent>
						<p className="mt-2 mb-1 max-w-80">
							We use{" "}
							<strong className="font-semibold">Large Language Models</strong>{" "}
							(LLMs) to predict the sentiment of articles.
						</p>
						<p className="mb-2 max-w-80">
							To know more about the methodology, see the{" "}
							<Link
								href="/docs/charts/mediaSentimentTrend/methodology"
								className={cn(
									"underline decoration-grayMed underline-offset-2 decoration-2",
									"focusable hover:decoration-grayDark transition",
								)}
							>
								documentation
							</Link>
							.
						</p>
					</TooltipContent>
				</Portal>
			</Tooltip>
		);
	},
);
