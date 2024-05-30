import { cn } from "@/utility/classNames";

function MediaSentimentChartEmpty() {
	return (
		<div
			className={cn(
				"w-full h-[var(--media-coverage-chart-height)]",
				"flex justify-center items-center",
				"bg-grayUltraLight border border-grayLight",
			)}
		>
			<p>No data for the current filter configuration</p>
		</div>
	);
}

export default MediaSentimentChartEmpty;
