import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import slugify from "slugify";
import { getFullTextsData } from "./fullTextsUtil";
import useEvents from "./useEvents";

export function useFullTexts({ event_id }: { event_id?: string }) {
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const { data } = useEvents();
	const { today } = useToday();
	const organizersKey = useMemo(
		() =>
			organizers
				.map((o) => slugify(o, { lower: true, strict: true }))
				.sort()
				.join("-"),
		[organizers],
	);
	const queryKey = ["fulltexts", event_id, organizersKey];
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			getFullTextsData({
				event_id: event_id || "",
				organizers,
				allOrganisations: data.organisations || [],
				today,
			}),
		enabled: !!event_id,
	});
	return query;
}
