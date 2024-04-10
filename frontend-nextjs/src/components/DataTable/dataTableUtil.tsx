import { Button } from '@components/ui/button'
import { ColumnDefTemplate, HeaderContext } from '@tanstack/react-table'
import { cn } from '@utility/classNames'
import {
	ArrowDown01,
	ArrowDownAZ,
	ArrowUp01,
	ArrowUpAZ,
	ArrowUpDown,
} from 'lucide-react'
import { ReactNode } from 'react'

type ColumnHeaderFunction<P> = ColumnDefTemplate<HeaderContext<P, unknown>>

export function getSortableHeaderTemplate<P>(
	label: ReactNode,
	numeric = false,
) {
	const templateFunction: ColumnHeaderFunction<P> = ({ column }) => {
		const sort = column.getIsSorted()
		const iconClass = cn('ml-2 h-4 w-4', sort && 'text-fg')
		const AscIcon = numeric ? ArrowDown01 : ArrowDownAZ
		const DescIcon = numeric ? ArrowUp01 : ArrowUpAZ
		return (
			<Button
				variant="ghost"
				onClick={() => {
					if (sort === 'desc') return column.clearSorting()
					column.toggleSorting(sort === 'asc')
				}}
				className={cn('-ml-4 hover:text-fg group')}
			>
				{label}
				{!sort && <ArrowUpDown className={iconClass} />}
				{sort === 'asc' && <AscIcon className={iconClass} />}
				{sort === 'desc' && <DescIcon className={iconClass} />}
			</Button>
		)
	}
	return templateFunction
}
