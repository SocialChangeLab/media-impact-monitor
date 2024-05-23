"use client";

import MediaSentimentChartLoading from "@/components/MediaSentimentChart/MediaSentimentChartLoading";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

function MediaSentimentRouteLoading() {
	return (
		<SectionHeadlineWithExplanation
			headline="Sentiment of climate change in German newspapers"
			description="See the media Sentiment of climate-related topics in germany over time"
			help="See the media Sentiment of climate-related topics in germany over time"
		>
			<MediaSentimentChartLoading />
		</SectionHeadlineWithExplanation>
	);
}

export default MediaSentimentRouteLoading;
