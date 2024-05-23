import MediaCoverageChart from "@/components/MediaCoverageChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { getMediaCoverageData } from "@/utility/mediaCoverageUtil";
import { parseSearchParamsFilters } from "@/utility/searchParamsUtil";

async function MediaCoverageRoute({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const { from, to } = parseSearchParamsFilters(searchParams);
	const data = await getMediaCoverageData(
		from && to ? { from, to } : undefined,
	);

	return (
		<SectionHeadlineWithExplanation
			headline="Coverage of climate change in German newspapers"
			description="See the media coverage of climate-related topics in germany over time"
			help="See the media coverage of climate-related topics in germany over time"
		>
			<MediaCoverageChart data={data} />
		</SectionHeadlineWithExplanation>
	);
}

export default MediaCoverageRoute;
