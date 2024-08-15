import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { titleCase } from "@/utility/textUtil";
import { topicIsSentiment } from "@/utility/topicsUtil";
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
				style={{ textDecorationColor: color }}
			>
				{isSentiment ? label : titleCase(label)}
			</span>
		);
	},
);

export const topicsMap = new Map<string, string[][]>(
	Object.entries({
		[slugify("Climate S", { lower: true, strict: true })]: [
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
