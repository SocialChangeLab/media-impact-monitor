import { cn } from "@/utility/classNames";
import ComponentError from "../ComponentError";

function MediaCoverageChartError({
	details,
	reset,
	message = "There was an unexpected error while fetching the data:",
}: {
	details?: string;
	reset?: () => void;
	message?: string;
}) {
	return (
		<div
			className={cn(
				"w-full min-h-96 p-8 border border-grayLight",
				"flex items-center justify-center bg-grayUltraLight",
			)}
		>
			<ComponentError
				errorMessage={message}
				errorDetails={details}
				reset={reset}
			/>
		</div>
	);
}

export default MediaCoverageChartError;
