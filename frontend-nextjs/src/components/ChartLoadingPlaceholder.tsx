import { cn } from "@/utility/classNames";
import { texts } from "@/utility/textUtil";
import { Loader2 } from "lucide-react";

function ChartLoadingPlaceholder() {
	return (
		<div
			className={cn(
				"h-[var(--media-coverage-chart-height)] bg-grayUltraLight motion-safe:animate-pulse border border-grayLight flex items-center justify-center",
			)}
		>
			<span className="inline-flex gap-1 items-center">
				<Loader2
					className={cn(
						"mr-2 h-4 w-4 animate-spin duration-1000 text-grayDark",
					)}
					aria-hidden="true"
				/>
				{texts.charts.common.loading}
			</span>
		</div>
	);
}

export default ChartLoadingPlaceholder;
