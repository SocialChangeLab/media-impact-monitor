import { useEffect, useState } from 'react'
import { getEventsData } from './eventsUtil'

type Query<T> =
	| {
			data: T
			isPending: false
			error: null
	  }
	| {
			data?: T
			isPending: true
			error: null
	  }
	| {
			data?: undefined
			isPending: false
			error: Error
	  }

export type EventType = {
	event_id: string
	event_type: string
	source: string
	topic: string
	date: string
	organizations: string[]
	description: string
}

function useEvents() {
	const [query, setQuery] = useState<Query<EventType[]>>({
		data: undefined,
		isPending: true,
		error: null,
	})

	useEffect(() => {
		let ignore = false

		const fetchData = async () => {
			try {
				const data = await getEventsData()
				if (ignore) return
				setQuery({ data, isPending: false, error: null })
			} catch (error) {
				if (ignore) return
				setQuery({
					data: undefined,
					isPending: false,
					error: error instanceof Error ? error : new Error('Unknown error'),
				})
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
