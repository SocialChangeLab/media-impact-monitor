'use client'

import { DataTable } from '@components/DataTable'
import { EventType } from '@utility/useEvents'
import { useMemo } from 'react'
import { getColumns } from './columns'

function EventsTable({ data }: { data: EventType[] }) {
	const columns = useMemo(getColumns, [])
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold font-headlines antialiased">
					{'Events'}
				</h1>
			</div>
			{<DataTable columns={columns} data={data} />}
		</div>
	)
}

export default EventsTable
