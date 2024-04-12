import { useEffect, useState } from 'react'
import { EventDataType, getEventsData } from './eventsUtil'

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

function useEvents() {
	const [query, setQuery] = useState<Query<EventDataType>>({
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
