"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { queryOptions, useQuery } from "@tanstack/react-query";
import {
	type EventMediaInputQueryType,
	eventMediaInputQueryZodSchema,
	getEventMediaData,
} from "./eventMediaUtil";
import type { OrganisationType, ParsedEventType } from "./eventsUtil";
import { getStaleTime } from "./queryUtil";
import { today } from "./today";
import { useAllOrganisations } from "./useOrganisations";
import useQueryErrorToast from "./useQueryErrorToast";

function getEventMediaQueryOptions(
	allOrganisations: OrganisationType[],
	isLoading: boolean,
	query?: Partial<EventMediaInputQueryType>,
) {
	const queryParsing = eventMediaInputQueryZodSchema.safeParse(query);
	const key = queryParsing.success
		? ["eventMedia", queryParsing.data.eventId]
		: ["eventMedia", null];
	return queryOptions({
		queryKey: key,
		queryFn: () =>
			queryParsing.success
				? getEventMediaData(
						{
							eventId: queryParsing.data.eventId,
							mediaSource: "news_online",
							topic: "climate_change",
						},
						allOrganisations,
					)
				: null,
		staleTime: getStaleTime(today),
		enabled: !isLoading && queryParsing.success,
	});
}

function useEventMedia(eventId?: ParsedEventType["event_id"]) {
	const { organisations, isLoading } = useAllOrganisations();
	const organizers = useFiltersStore(({ organizers }) => organizers);
	const mediaSource = useFiltersStore(({ mediaSource }) => mediaSource);
	const topic = useFiltersStore(({ topic }) => topic);
	const from = useFiltersStore(({ from }) => from);
	const to = useFiltersStore(({ to }) => to);
	const query = useQuery(
		getEventMediaQueryOptions(organisations || [], isLoading, {
			eventId,
			organizers,
			from,
			to,
			mediaSource,
			topic,
		}),
	);

	useQueryErrorToast("articles", query.error);

	return query;
}

export default useEventMedia;
