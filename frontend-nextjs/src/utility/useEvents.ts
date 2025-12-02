'use client'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { useToday } from '@/providers/TodayProvider'
import {
	type UseQueryResult,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { getTime } from 'date-fns'
import { useEffect } from 'react'
import {
	type OrganisationType,
	type ParsedEventType,
	getEventsData
} from './eventsUtil'
import { getStaleTime } from './queryUtil'
import { useOrganizersKey } from './useOrganisations'
import useQueryErrorToast from './useQueryErrorToast'

export type UseEventsReturnType = Omit<
	UseQueryResult<ParsedEventType[], unknown>,
	'data'
> & {
	data: {
		allEvents: ParsedEventType[]
		events: ParsedEventType[]
		eventsByOrgs: ParsedEventType[]
		organisations: OrganisationType[]
		selectedOrganisations: OrganisationType[]
	}
}

export function useAllEvents() {
	// const queryClient = useQueryClient()
	// const { today } = useToday()
	// const topic = useFiltersStore(({ topic }) => topic)

	// const query = useQuery({
	// 	queryKey: ['allEvents', topic],
	// 	queryFn: async () => await getEventsData({ topic }, today),
	// 	staleTime: getStaleTime(today),
	// })
	// const { data, error } = query

	// useQueryErrorToast('protests', error)

	// useEffect(() => {
	// 	if (!data || data.length === 0) return
	// 	for (const event of data) {
	// 		queryClient.setQueryData(['events', event.event_id], event)
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [data])

	// return {
	// 	...query,
	// 	allEvents: data ?? [],
	// }
	// Protest data temporarily disabled
	return {
		allEvents: [] as ParsedEventType[],
		data: [] as ParsedEventType[],
		isLoading: false,
		isFetching: false,
		isPending: false,
		isError: false,
		error: null,
	}
}

export function useTimeFilteredEvents() {
	const { allEvents, isLoading } = useAllEvents()
	const fromTime = useFiltersStore(({ from }) => getTime(from))
	const toTime = useFiltersStore(({ to }) => getTime(to))

	const query = useQuery({
		queryKey: ['timeFilteredEvents', fromTime, toTime],
		queryFn: () => {
			const eventsInTimeRange = (allEvents ?? []).filter((e) => {
				if (!e.date) return false
				const beforeFrom = e.time < fromTime
				const afterTo = e.time > toTime
				if (beforeFrom || afterTo) return false
				return true
			})
			return eventsInTimeRange
		},
		enabled: !isLoading && allEvents.length > 0,
	})

	return {
		...query,
		timeFilteredEvents: query.data ?? [],
	}
}

export function useFilteredEvents() {
	const { timeFilteredEvents, isLoading } = useTimeFilteredEvents()
	const organizers = useFiltersStore(({ organizers }) => organizers)
	const organizersKey = useOrganizersKey()

	const query = useQuery({
		queryKey: ['filteredEvents', timeFilteredEvents, organizersKey],
		queryFn: () => {
			if (organizers.length === 0) return timeFilteredEvents
			const eventsOfSelectedOrgs = timeFilteredEvents.filter((e) =>
				organizers.find((orgSlug) =>
					e.organizers.find((x) => x.slug === orgSlug),
				),
			);
			return eventsOfSelectedOrgs
		},
		enabled: !isLoading
	})

	return {
		...query,
		filteredEvents: query.data ?? [],
	}
}
