'use client'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { useToday } from '@/providers/TodayProvider'
import {
	type UseQueryResult,
	useQuery,
} from '@tanstack/react-query'
import { getTime } from 'date-fns'
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
	const { today } = useToday()
	const topic = useFiltersStore(({ topic }) => topic)
	const query = useQuery({
		queryKey: ['allEvents', 'summary-v1', topic],
		queryFn: () => getEventsData({ topic }, today),
		staleTime: getStaleTime(today),
	})
	useQueryErrorToast('protests', query.error)
	return { ...query, allEvents: query.data ?? [] }
}

export function useTimeFilteredEvents() {
	const { allEvents, isLoading } = useAllEvents()
	const fromTime = useFiltersStore(({ from }) => getTime(from))
	const toTime = useFiltersStore(({ to }) => getTime(to))

	const query = useQuery({
		queryKey: ['timeFilteredEvents', allEvents, fromTime, toTime],
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
		enabled: !isLoading,
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
