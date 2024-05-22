import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import type { ReactNode } from "react";

function MediaSentimentLayout({ children }: { children: ReactNode }) {
	return (
		<SectionHeadlineWithExplanation
			headline="Coverage of climate change in German newspapers"
			description="See the media coverage of climate-related topics in germany over time"
			help="See the media coverage of climate-related topics in germany over time"
		>
			{children}
		</SectionHeadlineWithExplanation>
	);
}

export default MediaSentimentLayout;
