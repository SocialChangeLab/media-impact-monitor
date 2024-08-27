import { cn } from "@/utility/classNames";
import type { LucideIcon } from "lucide-react";

function ChartLimitations({
	limitations,
	Icon,
	term = "chart",
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
					We can't show this {term}
				</strong>
				<p className="text-base text-grayDark">
					Given the the following limitations:
				</p>
				<ul className={cn("flex flex-col gap-2")}>
					{limitations.map((l) => (
						<li className="text-base text-grayDark list-disc ml-5" key={l}>
							{l}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default ChartLimitations;
