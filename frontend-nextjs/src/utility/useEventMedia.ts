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
import useEvents from "./useEvents";
import useQueryErrorToast from "./useQueryErrorToast";

export function getEventMediaQueryOptions(
	allOrganisations: OrganisationType[],
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
		enabled: queryParsing.success,
	});
}

function useEventMedia(eventId?: ParsedEventType["event_id"]) {
	const { data } = useEvents();
	const { organizers, mediaSource, from, to } = useFiltersStore(
		({ organizers, mediaSource, from, to }) => ({
			organizers,
			mediaSource,
			from,
			to,
		}),
	);
	const query = useQuery(
		getEventMediaQueryOptions(data?.organisations || [], {
			eventId,
			organizers,
			from,
			to,
			mediaSource,
		}),
	);

	useQueryErrorToast("articles", query.error);

	return query;
}

export default useEventMedia;
