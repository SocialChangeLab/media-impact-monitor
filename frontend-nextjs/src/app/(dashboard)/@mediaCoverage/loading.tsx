"use client";

import MediaCoverageChartLoading from "@/components/MediaCoverageChart/MediaCoverageChartLoading";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

function MediaCoverageRouteLoading() {
	return (
		<SectionHeadlineWithExplanation
			headline="Coverage of climate change in German newspapers"
			description="See the media coverage of climate-related topics in germany over time"
			help="See the media coverage of climate-related topics in germany over time"
		>
			<MediaCoverageChartLoading />
		</SectionHeadlineWithExplanation>
	);
}

export default MediaCoverageRouteLoading;
