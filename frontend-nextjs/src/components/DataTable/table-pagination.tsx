import { Combobox } from '@/components/ui/combobox'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utility/classNames'
import { type Table as ReactTableType } from '@tanstack/react-table'

type TablePaginationProps<RecordType> = Pick<
	ReactTableType<RecordType>,
	| 'getState'
	| 'setPageIndex'
	| 'getCanPreviousPage'
	| 'getPageCount'
	| 'getCanNextPage'
	| 'nextPage'
	| 'previousPage'
	| 'setPageSize'
>

function TablePagination<RecordType>({
	getState,
	setPageIndex,
	getCanPreviousPage,
	getPageCount,
	getCanNextPage,
	nextPage,
	previousPage,
	setPageSize,
}: TablePaginationProps<RecordType>) {
	const currentPage = getState().pagination.pageIndex + 1
	const paginationRange = getPaginationRangeWithEllipsis(
		currentPage,
		getPageCount(),
		5,
	)
	return (
		<Pagination>
			<PaginationContent>
				{currentPage !== 1 && (
					<PaginationItem>
						<PaginationFirst onClick={() => setPageIndex(0)} />
					</PaginationItem>
				)}
				{getCanPreviousPage() && (
					<PaginationItem>
						<PaginationPrevious onClick={() => previousPage()} />
					</PaginationItem>
				)}
				{paginationRange.map((page) => {
					if (typeof page === 'string') {
						return (
							<PaginationItem key={page}>
								<PaginationEllipsis />
							</PaginationItem>
						)
					}
					return (
						<PaginationItem key={page}>
							<PaginationLink
								onClick={() => setPageIndex(page - 1)}
								className={cn(
									page === currentPage && 'bg-grayLight',
									'pt-2 pb-1',
								)}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					)
				})}
				{/* <PaginationItem>
					<PaginationEllipsis />
				</PaginationItem> */}
				{getCanNextPage() && (
					<PaginationItem>
						<PaginationNext onClick={() => nextPage()} />
					</PaginationItem>
				)}
				{currentPage !== getPageCount() && (
					<PaginationItem>
						<PaginationLast onClick={() => setPageIndex(getPageCount() - 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
			<Combobox
				options={['10', '20', '30', '40', '50'].map((pageSize) => ({
					label: `${pageSize} items`,
					value: pageSize,
				}))}
				value={getState().pagination.pageSize.toString()}
				onChange={(value) => setPageSize(parseInt(value, 10))}
			/>
		</Pagination>
	)
}

function getPaginationRangeWithEllipsis(
	currentPage: number,
	totalPages: number,
	rangeSize: number = 5,
): (number | string)[] {
	let startPage: number, endPage: number
	const paginationRange: (number | string)[] = []

	if (totalPages <= rangeSize) {
		// Case when total pages is less than or equal to rangeSize
		for (let i = 1; i <= totalPages; i++) {
			paginationRange.push(i)
		}
	} else {
		const pagesBeforeCurrentPage = Math.floor(rangeSize / 2)
		const pagesAfterCurrentPage = Math.ceil(rangeSize / 2) - 1

		if (currentPage <= pagesBeforeCurrentPage) {
			// Current page is in the beginning; show first rangeSize pages
			startPage = 1
			endPage = rangeSize
			for (let i = startPage; i <= endPage; i++) {
				paginationRange.push(i)
			}
			paginationRange.push('el1')
		} else if (currentPage + pagesAfterCurrentPage >= totalPages) {
			// Current page is at the end; show last rangeSize pages
			paginationRange.push('el2')
			startPage = totalPages - rangeSize + 1
			endPage = totalPages
			for (let i = startPage; i <= endPage; i++) {
				paginationRange.push(i)
			}
		} else {
			// Current page is somewhere in the middle; show some pages before and after it
			paginationRange.push('el3')
			startPage = currentPage - pagesBeforeCurrentPage
			endPage = currentPage + pagesAfterCurrentPage
			for (let i = startPage; i <= endPage; i++) {
				paginationRange.push(i)
			}
			paginationRange.push('el4')
		}
	}

	return paginationRange
}

export default TablePagination
