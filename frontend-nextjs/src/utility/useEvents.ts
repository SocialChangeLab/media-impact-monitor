'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EventDataType, Query, getEventsData } from './eventsUtil'

function useEvents(initialData?: Query<EventDataType>) {
	const [query, setQuery] = useState<Query<EventDataType>>(
		initialData || {
			data: undefined,
			isPending: true,
			error: null,
		},
	)

	useEffect(() => {
		if (!initialData?.error) return
		if (toast.length > 0) return
		const to = setTimeout(() => {
			toast.error(`Error fetching events: ${initialData.error}`, {
				important: true,
				dismissible: false,
				duration: 1000000,
			})
		}, 10)
		return () => clearTimeout(to)
	}, [initialData?.error])

	useEffect(() => {
		let ignore = false
		if (typeof initialData !== 'undefined') return

		const fetchData = async () => {
			try {
				const response = await getEventsData()
				if (ignore) return
				setQuery({ data: response.data, isPending: false, error: null })
			} catch (error) {
				if (ignore) return
				setQuery({
					data: {
						events: [],
						organisations: [],
					},
					isPending: false,
					error:
						error instanceof Error ? error.message : `Unknown error: ${error}`,
				})
				toast.error(`Error fetching events: ${error}`)
			}
		}
		fetchData()

		return () => {
			ignore = true
		}
	}, [])

	return query
}

export default useEvents
