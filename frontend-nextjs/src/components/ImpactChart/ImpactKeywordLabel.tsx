import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { texts, titleCase } from "@/utility/textUtil";
import Link from "next/link";
import { type ReactNode, memo } from "react";
import slugify from "slugify";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ImpactKeywordLabel = memo(
	({
		label,
		slug,
		color,
		className,
	}: { label: string; slug: string; color: string; className?: string }) => {
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
							{texts.charts.keywordsTooltip.intro({
								categoryNode: children,
								keywordsCount: keywords[0].length.toLocaleString(
									texts.language,
								),
							})}
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
									<p key="OR" className="mt-3 mb-0.5 w-96">
										{texts.charts.keywordsTooltip.andText({
											keywordsCount: keywordList.length.toLocaleString(
												texts.language,
											),
										})}
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
							{texts.charts.sentimentTooltip.intro}
						</p>
						<p className="mb-2 max-w-80">
							{texts.charts.sentimentTooltip.linkToDocs({
								LinkWrapper: ({ children }: { children: ReactNode }) => (
									<Link
										href="/docs/charts/mediaSentimentTrend/methodology"
										className={cn(
											"underline decoration-grayMed underline-offset-2 decoration-2",
											"focusable hover:decoration-grayDark transition",
										)}
									>
										{children}
									</Link>
								),
							})}
						</p>
					</TooltipContent>
				</Portal>
			</Tooltip>
		);
	},
);
