'use client'

import { DataTable } from '@components/DataTable'
import { EventType } from '@utility/eventsUtil'
import { useMemo } from 'react'
import { getColumns } from '../../columns'

function EventsTable(props: {
	data: EventType[]
	error?: string
	reset?: () => void
}) {
	const columns = useMemo(getColumns, [])
	return <DataTable {...props} columns={columns} />
}

export default EventsTable
