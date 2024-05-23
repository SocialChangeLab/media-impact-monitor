"use client";
import ComponentError from "@/components/ComponentError";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";

function MediaCoverageRouteError({
	error,
	reset,
}: {
	error: unknown;
	reset?: () => void;
}) {
	const { message, details } = parseErrorMessage(error, "media sentiment data");
	return (
		<SectionHeadlineWithExplanation
			headline="Coverage of climate change in German newspapers"
			description="See the media coverage of climate-related topics in germany over time"
			help="See the media coverage of climate-related topics in germany over time"
		>
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
		</SectionHeadlineWithExplanation>
	);
}

export default MediaCoverageRouteError;
