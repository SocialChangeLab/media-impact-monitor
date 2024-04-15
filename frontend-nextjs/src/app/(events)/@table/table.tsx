'use client'

import { DataTable } from '@components/DataTable'
import { EventsDataType } from '@utility/eventsUtil'
import useEvents from '@utility/useEvents'
import { useMemo } from 'react'
import { getColumns } from '../../columns'
import EventsTablePageError from './error'
import EventsTablePageLoadng from './loading'

function EventsTable(props: {
	initialData: EventsDataType
	error?: string
	reset?: () => void
}) {
	const columns = useMemo(getColumns, [])
	const { data, isPending, error } = useEvents(props.initialData)
	if (error) return <EventsTablePageError error={error} />
	if (isPending) return <EventsTablePageLoadng />
	if (!data?.events) return null
	return <DataTable columns={columns} data={data?.events} />
}

export default EventsTable
