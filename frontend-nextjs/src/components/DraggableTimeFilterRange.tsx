import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { useToday } from '@/providers/TodayProvider'
import '@/styles/draggable-time-filter-range.css'
import { cn } from '@/utility/classNames'
import { dateToComparableDateItem } from '@/utility/comparableDateItemSchema'
import { format } from '@/utility/dateUtil'
import useEvents from '@/utility/useEvents'
import { isInSameAggregationUnit } from '@/utility/useTimeIntervals'
import useDebounce from '@custom-react-hooks/use-debounce'
import useElementSize from '@custom-react-hooks/use-element-size'
import { addDays, compareAsc, differenceInDays } from 'date-fns'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import RangeSlider from 'react-range-slider-input'
import useTimelineEvents from './EventsTimeline/useTimelineEvents'

function DraggableTimeFilterRange() {
	const { from, to, setDateRange } = useFiltersStore((state) => ({
		from: dateToComparableDateItem(state.from),
		to: dateToComparableDateItem(state.to),
		setDateRange: state.setDateRange,
	}))
	const { today, datasetStartDate, datasetEndDate } = useToday()
	const amountOfDays = differenceInDays(datasetEndDate, datasetStartDate) + 1
	const intervals = new Array(Math.abs(amountOfDays))
		.fill(null)
		.map((_, i) =>
			dateToComparableDateItem(addDays(datasetStartDate, i), today),
		)

	const indexOfFrom = useMemo(
		() => intervals.findIndex((d) => isInSameAggregationUnit('day', d, from)),
		[from, intervals],
	)
	const indexOfTo = useMemo(
		() => intervals.findIndex((d) => isInSameAggregationUnit('day', d, to)),
		[to, intervals],
	)
	const initialValues = [indexOfFrom, indexOfTo] as [number, number]
	const [values, setValues] = useState<[number, number]>(initialValues)
	const [isDragging, setIsDragging] = useState(false)

	const leftDate = useMemo(() => {
		const d = intervals[values[0]].date
		if (!d) return undefined
		return format(d, 'dd. MMM. yyyy')
	}, [intervals, values])
	const rightDate = useMemo(() => {
		const d = intervals[values[1]].date
		if (!d) return undefined
		return format(d, 'dd. MMM. yyyy')
	}, [intervals, values])

	useEffect(() => {
		setValues([indexOfFrom, indexOfTo])
	}, [indexOfFrom, indexOfTo])

	const onChange = useCallback(
		([fromIdx, toIdx]: [number, number]) => {
			const [from, to] = [
				intervals[fromIdx] ?? intervals[0],
				intervals[toIdx] ?? intervals[intervals.length - 1],
			]
				.map((d) => d.date)
				.sort(compareAsc)

			setDateRange({ from, to })
			setIsDragging(false)
		},
		[intervals, setDateRange],
	)
	const [debouncedOnChange] = useDebounce(onChange, 500)

	return (
		<>
			<div
				className={cn(
					`w-full h-7 border border-grayLight`,
					`rounded-md relative`,
				)}
			>
				<BackgroundVis />
				<RangeSlider
					value={values}
					defaultValue={[indexOfFrom, indexOfTo]}
					step={1}
					min={0}
					max={intervals.length - 1}
					onInput={([from, to]) => {
						setValues([Math.max(0, from), Math.min(intervals.length - 1, to)])
					}}
					onRangeDragEnd={() => debouncedOnChange(values)}
					onThumbDragEnd={() => debouncedOnChange(values)}
					onRangeDragStart={() => setIsDragging(true)}
					onThumbDragStart={() => setIsDragging(true)}
					id="draggable-time-filter-range"
					className="group"
				/>
				<HandleTooptip
					formattedDate={leftDate}
					isStart
					isDragging={isDragging}
				/>
				<HandleTooptip
					formattedDate={rightDate}
					isStart={false}
					isDragging={isDragging}
				/>
			</div>
		</>
	)
}

const HandleTooptip = memo(
	({
		formattedDate,
		isStart,
		isDragging,
	}: {
		formattedDate?: string
		isStart: boolean
		isDragging: boolean
	}) => (
		<span
			className={cn(
				`absolute`,
				`bg-fg text-bg opacity-0 px-1 py-0.25 text-sm`,
				`group-hover:opacity-100 pointer-events-none`,
				`transition whitespace-nowrap text-center`,
				`grid grid-cols-[22px_35px_35px]`,
				isStart && `left-0 bottom-full group-hover:-translate-y-1`,
				!isStart && `right-0 top-full group-hover:translate-y-1`,
				isDragging && `opacity-100`,
				isDragging && isStart && `-translate-y-1`,
				isDragging && !isStart && `translate-y-1`,
			)}
		>
			{formattedDate
				?.split(' ')
				.map((part, i) => <span key={part}>{part}</span>)}
		</span>
	),
)

const BackgroundVis = memo(() => {
	const [parentRef, size] = useElementSize()
	const { datasetStartDate, datasetEndDate } = useToday()
	const { data } = useEvents({
		from: datasetStartDate,
		to: datasetEndDate,
	})
	const { eventColumns, columnsCount, sizeScale } = useTimelineEvents({
		size,
		data,
		aggregationUnit: 'week',
		config: {
			eventMinHeight: 2,
			eventMaxHeight: Math.floor(size.height * 0.9),
			aggregatedEventMaxHeight: Math.floor(size.height * 0.9),
		},
		from: datasetStartDate,
		to: datasetEndDate,
	})
	return (
		<span
			ref={parentRef}
			className={cn(
				`absolute top-0 left-0 h-full w-full pointer-events-none`,
				`z-0 grid gap-px rounded-md overflow-clip`,
			)}
			style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
		>
			{eventColumns.map(({ time, sumSize }) => (
				<span key={time} className="size-full flex flex-col gap-px justify-end">
					<span
						className="w-full h-0.5 bg-grayLight"
						style={{ height: sizeScale(sumSize) }}
					/>
				</span>
			))}
		</span>
	)
})

export default DraggableTimeFilterRange
