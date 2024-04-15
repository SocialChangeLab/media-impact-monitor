'use client'

import { DataTable } from '@components/DataTable'
import useEvents from '@utility/useEvents'
import { useMemo } from 'react'
import { getColumns } from '../../columns'

function EventsTable(props: { error?: string; reset?: () => void }) {
	const columns = useMemo(getColumns, [])
	const { data } = useEvents()
	return <DataTable columns={columns} data={data?.events} />
}

export default EventsTable
