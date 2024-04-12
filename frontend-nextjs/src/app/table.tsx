'use client'

import { DataTable } from '@components/DataTable'
import { EventType } from '@utility/eventsUtil'
import { useMemo } from 'react'
import { getColumns } from './columns'

function EventsTable({ data }: { data: EventType[] }) {
	const columns = useMemo(getColumns, [])
	return <DataTable columns={columns} data={data} />
}

export default EventsTable
