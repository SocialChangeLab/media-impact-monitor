import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import { useAllOrganisations } from "@/utility/useOrganisations";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import slugify from "slugify";
import { getFullTextsData } from "./fullTextsUtil";

export function useFullTexts({ event_id }: { event_id?: string }) {
	const { today } = useToday();
	const queryKey = ["fulltexts", event_id];
	const query = useQuery({
		queryKey,
		queryFn: async () =>
			getFullTextsData({
				event_id: event_id || "",
				today,
			}),
	});
	return query;
}
