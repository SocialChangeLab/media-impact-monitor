import MediaSentimentChart from "@/components/MediaSentimentChart";
import MediaSentimentChartEmpty from "@/components/MediaSentimentChart/MediaSentimentChartEmpty";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { defaultInitState } from "@/stores/filtersStore";
import { getMediaSentimentData } from "@/utility/mediaSentimentUtil";
import { parseSearchParamsFilters } from "@/utility/searchParamsUtil";

async function MediaSentimentRoute({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const { from, to } = parseSearchParamsFilters(searchParams);
	const data = await getMediaSentimentData(
		from && to
			? { from, to }
			: {
					from: defaultInitState.from,
					to: defaultInitState.to,
				},
	);

	if (!data) return <MediaSentimentChartEmpty />;
	return (
		<SectionHeadlineWithExplanation
			headline="Media Sentiment of climate change in German newspapers"
			description="See the media sentiment of climate-related topics in germany over time"
			help="See the media sentiment of climate-related topics in germany over time"
		>
			<MediaSentimentChart data={data} />
		</SectionHeadlineWithExplanation>
	);
}

export default MediaSentimentRoute;
