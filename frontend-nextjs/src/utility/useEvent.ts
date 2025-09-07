"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	type ParsedEventType,
	extractEventOrganisations,
	getEventData,
} from "./eventsUtil";
import { getStaleTime } from "./queryUtil";
import { today } from "./today";
import useQueryErrorToast from "./useQueryErrorToast";

export function getEventQueryOptions(id?: ParsedEventType["event_id"]) {
	return queryOptions({
		queryKey: ["events", id],
		queryFn: () => (id ? getEventData(id) : null),
		staleTime: getStaleTime(today),
		enabled: id !== undefined,
	});
}

function useEvent(id?: ParsedEventType["event_id"]) {
	const query = useQuery(getEventQueryOptions(id));
	const topic = useFiltersStore(({ topic }) => topic);

	useQueryErrorToast("protest", query.error);

	const organisations = useMemo(
		() =>
			(query.data ? extractEventOrganisations([query.data], topic) : []).filter(
				Boolean,
			),
		[query.data, topic],
	);

	return {
		...query,
		data: query.data ? { event: query.data, organisations } : null,
	};
}

export default useEvent;
