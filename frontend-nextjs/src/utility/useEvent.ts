"use client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { useMemo } from "react";
import {
	type ParsedEventType,
	extractEventOrganisations,
	getEventData,
} from "./eventsUtil";
import useQueryErrorToast from "./useQueryErrorToast";

export function getEventQueryOptions(id?: ParsedEventType["event_id"]) {
	return queryOptions({
		queryKey: ["events", id],
		queryFn: () => (id ? getEventData(id) : null),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
		enabled: id !== undefined,
	});
}

function useEvent(id?: ParsedEventType["event_id"]) {
	const query = useQuery(getEventQueryOptions(id));

	useQueryErrorToast("protest", query.error);

	const organisations = useMemo(
		() => (query.data ? extractEventOrganisations([query.data]) : []),
		[query.data],
	);

	return {
		...query,
		data: query.data ? { event: query.data, organisations } : null,
	};
}

export default useEvent;
