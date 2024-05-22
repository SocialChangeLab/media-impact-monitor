import MediaSentimentChart from "@/components/MediaSentimentChart";
import { getMediaSentimentData } from "@/utility/mediaSentimentUtil";
import { parseSearchParamsFilters } from "@/utility/searchParamsUtil";

async function MediaSentimentRoute({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const { from, to } = parseSearchParamsFilters(searchParams);
	const data = await getMediaSentimentData(
		from && to ? { from, to } : undefined,
	);

	return <MediaSentimentChart data={data} />;
}

export default MediaSentimentRoute;
