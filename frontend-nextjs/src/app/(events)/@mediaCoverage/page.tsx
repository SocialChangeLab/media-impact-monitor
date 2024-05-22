import MediaCoverageChart from "@/components/MediaCoverageChart";
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

	return <MediaCoverageChart data={data} />;
}

export default MediaCoverageRoute;
