'use client'
import { defaultFrom, defaultTo } from '@/app/(events)/config'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getEventsData } from './eventsUtil'
import useQueryParams from './useQueryParams'

function useEvents() {
	const { searchParams, setSearchParams } = useQueryParams()
	const [from, setFrom] = useState(new Date(defaultFrom))
	const [to, setTo] = useState(new Date(defaultTo))
	const queryKey = ['events', from.toISOString(), to.toISOString()]
	const { data, isPending, error } = useSuspenseQuery({
		queryKey,
		queryFn: async () => {
			const { data, error } = await getEventsData({ from, to })
			if (error) throw new Error(error)
			return data
		},
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

	useEffect(() => {
		if (!searchParams?.from || !searchParams?.to) return
		setFrom(searchParams.from)
		setTo(searchParams.to)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams?.from?.toISOString(), searchParams?.to?.toISOString()])

	const setDateRange = useCallback(
		({ from, to }: { from: Date; to: Date }) => {
			setFrom(from)
			setTo(to)
			setSearchParams({ from, to })
		},
		[setSearchParams],
	)

	return {
		data,
		isPending,
		error,
		from,
		to,
		setDateRange,
	}
}

export default useEvents
