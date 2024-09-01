'use client'
import LoadingEventsTimeline from '@/components/EventsTimeline/LoadingEventsTimeline'
import { cn } from '@/utility/classNames'
import { type ComparableDateItemType } from '@/utility/comparableDateItemSchema'
import { format } from '@/utility/dateUtil'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import useEvents, { type UseEventsReturnType } from '@/utility/useEvents'
import { isInSameAggregationUnit } from '@/utility/useTimeIntervals'
import useElementSize from '@custom-react-hooks/use-element-size'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Suspense } from 'react'
import InViewContainer from '../InViewContainer'
import EmptyEventsTimeline from './EmptyEventsTimeline'
import ErrorEventsTimeline from './ErrorEventsTimeline'
import EventTimelineItem from './EventTimelineItem'
import EventsTimelineWrapper from './EventsTimelinWrapper'
import EventsTimelineAggregatedItem from './EventsTimelineAggregatedItem'
import EventsTimelineAxis from './EventsTimelineAxis'
import EventsTimelineChartWrapper from './EventsTimelineChartWrapper'
import EventsTimelineLegend from './EventsTimelineLegend'
import EventsTimelineScrollWrapper from './EventsTimelineScrollWrapper'
import useAggregationUnit from './useAggregationUnit'
import useTimelineEvents from './useTimelineEvents'

type DataSourceInsertionType = {
	date: ComparableDateItemType
	name: string
}

function EventsTimeline({ data }: { data: UseEventsReturnType['data'] }) {
	const [parentRef, size] = useElementSize()
	const { organisations, eventsByOrgs, selectedOrganisations } = data
	const aggregationUnit = useAggregationUnit(size.width)
	const { eventColumns, columnsCount, sizeScale } = useTimelineEvents({
		size,
		data,
		aggregationUnit,
	})
	// const { today } = useToday();
	const dataSourceInsertions: DataSourceInsertionType[] = [
		// {
		// 	date: dateToComparableDateItem(
		// 		new Date("2022-01-01T00:00:00.000Z"),
		// 		today,
		// 	),
		// 	name: "ACLED (Armed Conflict Location & Event Data Project)",
		// },
		// {
		// 	date: dateToComparableDateItem(
		// 		new Date("2022-07-01T00:00:00.000Z"),
		// 		today,
		// 	),
		// 	name: "Press Releases by Last Generation",
		// },
	]
	if (eventsByOrgs.length === 0) return <EmptyEventsTimeline />

	return (
		<EventsTimelineWrapper organisations={organisations} ref={parentRef}>
			<EventsTimelineScrollWrapper>
				<EventsTimelineChartWrapper columnsCount={columnsCount + 1}>
					{eventColumns.map((props) => {
						const {
							time,
							date,
							eventsWithSize,
							sumSize,
							combinedOrganizers,
							combinedSelectedOrganizers,
						} = props
						const insertedDataSource = dataSourceInsertions.find((d) =>
							isInSameAggregationUnit(aggregationUnit, d.date, props),
						)
						const indexOfDataSourceInsertion = dataSourceInsertions.findIndex(
							(d) => d === insertedDataSource,
						)
						const colIdx = eventColumns.findIndex((d) => d.date === date)
						const colsAfter = eventColumns.length - colIdx - 1
						const dataSourceTop = `${indexOfDataSourceInsertion * 3}rem`
						return (
							<li
								key={`event-day-${time}`}
								className="grid grid-rows-subgrid row-span-3 relative w-4 grow shrink-0 h-full py-4"
							>
								<div className="flex flex-col justify-end items-center gap-0.5">
									<div
										className={cn(
											'w-px h-full absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none',
											'bg-grayLight group-hover:opacity-50 event-line opacity-0 transition-opacity',
											insertedDataSource &&
												'opacity-100 group-hover:opacity-100 bg-gradient-to-t via-grayLight from-grayUltraLight to-fg',
										)}
										aria-hidden={!insertedDataSource}
									>
										{insertedDataSource && (
											<span
												className={cn(
													'grid sticky top-0 p-4 text-sm select-none whitespace-nowrap',
													'opacity-0 transition-opacity group-hover:opacity-100 w-fit',
													colsAfter < 10
														? 'text-right -translate-x-full'
														: 'left-px',
												)}
												style={{ top: dataSourceTop }}
											>
												<span className="uppercase text-xs text-grayDark opacity-80">
													{format(insertedDataSource.date.date, 'LLLL d, yyyy')}
													{' • '}
													Dataset Insertion
												</span>
												{insertedDataSource.name}
											</span>
										)}
									</div>
									{aggregationUnit === 'day' &&
										eventsWithSize.map((event) => (
											<EventTimelineItem
												key={event.event_id}
												event={event}
												organisations={organisations}
												selectedOrganisations={selectedOrganisations}
												height={sizeScale(event.size_number ?? 0)}
											/>
										))}
									{aggregationUnit !== 'day' && eventsWithSize.length > 0 && (
										<EventsTimelineAggregatedItem
											date={date}
											sumSize={sumSize}
											height={Math.ceil(sizeScale(sumSize))}
											organisations={combinedOrganizers}
											selectedOrganisations={combinedSelectedOrganizers}
											events={eventsWithSize}
											aggregationUnit={aggregationUnit}
										/>
									)}
								</div>
							</li>
						)
					})}
				</EventsTimelineChartWrapper>
				<EventsTimelineAxis
					eventColumns={eventColumns}
					aggregationUnit={aggregationUnit}
					width={size.width}
				/>
			</EventsTimelineScrollWrapper>
			<EventsTimelineLegend
				sizeScale={sizeScale}
				selectedOrganisations={selectedOrganisations}
			/>
		</EventsTimelineWrapper>
	)
}

function EventsTimelineWithData({ reset }: { reset?: () => void }) {
	const { data, isFetching, isPending, error, isError } = useEvents()
	if (isFetching || isPending) return <LoadingEventsTimeline />
	if (isError)
		return <ErrorEventsTimeline {...parseErrorMessage(error)} reset={reset} />
	if (data?.events.length > 0) return <EventsTimeline data={data} />
	return <EmptyEventsTimeline />
}
export default function EventsTimelineWithErrorBoundary() {
	return (
		<InViewContainer fallback={<LoadingEventsTimeline />}>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						errorComponent={({ error }) => (
							<ErrorEventsTimeline
								{...parseErrorMessage(error)}
								reset={reset}
							/>
						)}
					>
						<Suspense fallback={<LoadingEventsTimeline />}>
							<EventsTimelineWithData reset={reset} />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</InViewContainer>
	)
}
