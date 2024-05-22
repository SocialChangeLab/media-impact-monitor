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

	return (
		<code>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</code>
	);
}

export default MediaSentimentRoute;
