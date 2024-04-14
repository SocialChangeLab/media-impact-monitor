'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { EventsDataType, getEventsData } from './eventsUtil'
import useQueryParams from './useQueryParams'

function useEvents(initialData?: EventsDataType) {
	const { searchParams } = useQueryParams()
	const { data, isPending, error } = useQuery({
		queryKey: [
			'events',
			searchParams.from?.toISOString(),
			searchParams.to?.toISOString(),
		],
		queryFn: async () => {
			const { data, error } = await getEventsData(searchParams)
			if (error) throw new Error(error)
			return data
		},
		initialData,
	})

	useEffect(() => {
		if (!error) return
		if (toast.length > 0) return
		const to = setTimeout(() => {
			toast.error(`Error fetching events: ${error}`, {
				important: true,
				dismissible: false,
				duration: 1000000,
			})
		}, 10)
		return () => clearTimeout(to)
	}, [error])

	return {
		data,
		isPending,
		error,
	}
}

export default useEvents
