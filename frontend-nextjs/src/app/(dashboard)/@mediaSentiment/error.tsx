"use client";
import MediaSentimentChartError from "@/components/MediaSentimentChart/MediaSentimentChartError";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";

function MediaSentimentRouteError({
	error,
	reset,
}: {
	error: unknown;
	reset?: () => void;
}) {
	const { message, details } = parseErrorMessage(error, "media sentiment data");
	return (
		<SectionHeadlineWithExplanation
			headline="Sentiment of climate change in German newspapers"
			description="See the media Sentiment of climate-related topics in germany over time"
			help="See the media Sentiment of climate-related topics in germany over time"
		>
			<MediaSentimentChartError
				details={details}
				message={message}
				reset={reset}
			/>
		</SectionHeadlineWithExplanation>
	);
}

export default MediaSentimentRouteError;
