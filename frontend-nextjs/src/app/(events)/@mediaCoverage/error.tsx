"use client";
import MediaCoverageChartError from "@/components/MediaCoverageChart/MediaCoverageChartError";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
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
			<MediaCoverageChartError
				details={details}
				message={message}
				reset={reset}
			/>
		</SectionHeadlineWithExplanation>
	);
}

export default MediaCoverageRouteError;
