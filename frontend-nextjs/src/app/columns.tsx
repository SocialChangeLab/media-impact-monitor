import { EventType } from '@/utility/eventsUtil'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<EventType>()

export const getColumns = () => [
	columnHelper.accessor('description', {
		header: 'Description',
		size: 1000,
	}),
	// columnHelper.accessor('source', {
	// 	header: 'Source',
	// 	cell: function render({ getValue }) {
	// 		const value = getValue()
	// 		return getValue().charAt(0).toUpperCase() + getValue().slice(1)
	// 	},
	// }),
	// columnHelper.accessor('topic', {
	// 	header: 'Topic',
	// }),
	columnHelper.accessor('date', {
		header: 'Date',
		sortingFn: 'datetime',
		cell: function render({ getValue }) {
			return new Date(getValue() as string).toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			})
		},
	}),
	columnHelper.accessor('organizers', {
		header: 'Organizers',
		cell: function render({ getValue }) {
			return ((getValue() as string[] | null) ?? []).join(', ')
		},
	}),
]
