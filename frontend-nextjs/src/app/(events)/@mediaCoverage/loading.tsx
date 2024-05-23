"use client";

import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

function MediaCoverageRouteLoading() {
	return (
		<SectionHeadlineWithExplanation
			headline="Coverage of climate change in German newspapers"
			description="See the media coverage of climate-related topics in germany over time"
			help="See the media coverage of climate-related topics in germany over time"
		>
			<div className="h-[var(--media-coverage-chart-height)] bg-grayUltraLight motion-safe:animate-pulse border border-grayLight"></div>
		</SectionHeadlineWithExplanation>
	);
}

export default MediaCoverageRouteLoading;
