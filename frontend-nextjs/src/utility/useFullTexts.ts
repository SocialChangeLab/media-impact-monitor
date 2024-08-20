import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import slugify from "slugify";
import { getFullTextsData } from "./fullTextsUtil";
import useEvents from "./useEvents";

export function useFullTexts({ event_id }: { event_id: string }) {
	const mediaSource = useFiltersStore(({ mediaSource }) => mediaSource);
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const { data } = useEvents();
	const organizersKey = useMemo(
		() =>
			organizers
				.map((o) => slugify(o, { lower: true, strict: true }))
				.sort()
				.join("-"),
		[organizers],
	);
	const queryKey = ["fulltexts", event_id, mediaSource, organizersKey];
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			getFullTextsData({
				event_id,
				mediaSource,
				organizers,
				allOrganisations: data.organisations || [],
			}),
		enabled: !!event_id,
	});
	return query;
}
