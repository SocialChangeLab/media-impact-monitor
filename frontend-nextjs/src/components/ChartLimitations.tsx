import { cn } from "@/utility/classNames";
import { texts } from "@/utility/textUtil";
import type { LucideIcon } from "lucide-react";

function ChartLimitations({
	limitations,
	Icon,
}: { limitations: string[]; Icon?: LucideIcon; term?: string }) {
	return (
		<div
			className={cn(
				"h-[var(--media-coverage-chart-height)] bg-grayUltraLight border border-grayLight flex items-center justify-center ",
			)}
		>
			<div className="flex flex-col gap-2 max-w-96">
				{Icon && (
					<Icon size={56} strokeWidth={1} className="text-grayMed mb-4" />
				)}
				<strong className="text-2xl font-semibold font-headlines">
					{texts.charts.common.cantShowThisChart.heading}
				</strong>
				{limitations.length > 1 && (
					<p className="text-base text-grayDark">
						{texts.charts.common.cantShowThisChart.text}
					</p>
				)}
				{limitations.length === 1 && (
					<p className="text-base text-grayDark">
						{texts.charts.common.cantShowThisChart.limitationTranslations[
							limitations[0].trim() as keyof typeof texts.charts.common.cantShowThisChart.limitationTranslations
						] ?? limitations[0]}
					</p>
				)}
				{limitations.length > 1 && (
					<ul className={cn("flex flex-col gap-2")}>
						{limitations.map((l) => (
							<li className="text-base text-grayDark list-disc ml-5" key={l}>
								{texts.charts.common.cantShowThisChart.limitationTranslations[
									l.trim() as keyof typeof texts.charts.common.cantShowThisChart.limitationTranslations
								] ?? l}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default ChartLimitations;
