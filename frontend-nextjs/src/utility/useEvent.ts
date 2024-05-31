"use client";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
	type EventType,
	extractEventOrganisations,
	getEventData,
} from "./eventsUtil";

export function getEventQueryOptions(id?: EventType["event_id"]) {
	return queryOptions({
		queryKey: ["events", id],
		queryFn: () => (id ? getEventData(id) : null),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
		enabled: id !== undefined,
	});
}

function useEvent(id?: EventType["event_id"]) {
	const query = useSuspenseQuery(getEventQueryOptions(id));

	useEffect(() => {
		if (!query.error) return;
		toast.error(`Error fetching events: ${query.error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [query.error]);

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
