'use client'

import { DataTable } from '@components/DataTable'
import { EventsDataType } from '@utility/eventsUtil'
import useEvents from '@utility/useEvents'
import { useMemo } from 'react'
import { getColumns } from '../../columns'

function EventsTable(props: {
	initialData: EventsDataType
	error?: string
	reset?: () => void
}) {
	const columns = useMemo(getColumns, [])
	const { data } = useEvents(props.initialData)
	if (!data?.events) return null
	return <DataTable columns={columns} data={data?.events} />
}

export default EventsTable
