import MediaCoverageChart from "@/components/MediaCoverageChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

async function MediaCoverageRoute() {
	return (
		<SectionHeadlineWithExplanation
			headline="Coverage of climate change in German newspapers"
			description="See the media coverage of climate-related topics in germany over time"
			help="See the media coverage of climate-related topics in germany over time"
		>
			<MediaCoverageChart />
		</SectionHeadlineWithExplanation>
	);
}

export default MediaCoverageRoute;
