"use client";
import LoadingEventsTimeline from "@/components/EventsTimeline/LoadingEventsTimeline";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import useEvents, { type UseEventsReturnType } from "@/utility/useEvents";
import useElementSize from "@custom-react-hooks/use-element-size";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import CollapsableSection from "../CollapsableSection";
import DataCreditLegend from "../DataCreditLegend";
import OrgsLegend from "../OrgsLegend";
import EmptyEventsTimeline from "./EmptyEventsTimeline";
import ErrorEventsTimeline from "./ErrorEventsTimeline";
import EventTimelineItem from "./EventTimelineItem";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineAggregatedItem from "./EventsTimelineAggregatedItem";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineScrollWrapper from "./EventsTimelineScrollWrapper";
import EventsTimelineSizeLegend from "./EventsTimelineSizeLegend";
import useAggregationUnit from "./useAggregationUnit";
import useTimelineEvents from "./useTimelineEvents";

function EventsTimeline({
	data,
}: {
	data: UseEventsReturnType["data"];
}) {
	const [parentRef, size] = useElementSize();
	const { organisations, eventsByOrgs, selectedOrganisations } = data;
	const aggregationUnit = useAggregationUnit(size.width);
	const { eventColumns, columnsCount, sizeScale } = useTimelineEvents({
		size,
		data,
		aggregationUnit,
	});
	if (eventsByOrgs.length === 0) return <EmptyEventsTimeline />;

	return (
		<EventsTimelineWrapper organisations={organisations} ref={parentRef}>
			<EventsTimelineScrollWrapper>
				<EventsTimelineChartWrapper columnsCount={columnsCount + 1}>
					{eventColumns.map(
						({ time, date, eventsWithSize, sumSize, combinedOrganizers }) => (
							<li
								key={`event-day-${time}`}
								className="grid grid-rows-subgrid row-span-3 relative w-4 grow shrink-0 h-full py-4"
							>
								<div className="flex flex-col justify-end items-center gap-0.5">
									<div
										className={cn(
											"w-px h-full absolute top-0 left-1/2 -translate-x-1/2",
											"bg-grayLight group-hover:opacity-50 event-line opacity-0 transition-opacity",
										)}
										aria-hidden="true"
									/>
									{aggregationUnit === "day" &&
										eventsWithSize.map((event) => (
											<EventTimelineItem
												key={event.event_id}
												event={event}
												organisations={organisations}
												height={sizeScale(event.size_number ?? 0)}
											/>
										))}
									{aggregationUnit !== "day" && eventsWithSize.length > 0 && (
										<EventsTimelineAggregatedItem
											date={date}
											sumSize={sumSize}
											height={Math.ceil(sizeScale(sumSize))}
											organisations={combinedOrganizers}
											events={eventsWithSize}
											aggregationUnit={aggregationUnit}
										/>
									)}
								</div>
							</li>
						),
					)}
				</EventsTimelineChartWrapper>
				<EventsTimelineAxis
					eventColumns={eventColumns}
					aggregationUnit={aggregationUnit}
					width={size.width}
				/>
			</EventsTimelineScrollWrapper>
			<div className="pt-10 flex gap-[max(2rem,4vmax)] sm:grid sm:grid-cols-[1fr_auto]">
				<CollapsableSection
					title="Legend"
					storageKey="protest-timeline-legend-expanded"
				>
					<div className="grid gap-[max(1rem,2vmax)] md:grid-cols-[auto_1fr]">
						<EventsTimelineSizeLegend
							sizeScale={sizeScale}
							aggragationUnit={aggregationUnit}
						/>
						<OrgsLegend organisations={selectedOrganisations} />
					</div>
				</CollapsableSection>
				<DataCreditLegend
					storageKey={"protest-timeline-data-credit-expanded"}
					sources={[
						{
							label: "Protest data",
							links: [
								{
									text: "Armed Conflict Location & Event Data Project (ACLED)",
									url: "https://acleddata.com",
								},
							],
						},
					]}
				/>
			</div>
		</EventsTimelineWrapper>
	);
}

function EventsTimelineWithData({ reset }: { reset?: () => void }) {
	const { data, isFetching, isPending, error, isError } = useEvents();
	if (isFetching || isPending) return <LoadingEventsTimeline />;
	if (isError)
		return <ErrorEventsTimeline {...parseErrorMessage(error)} reset={reset} />;
	if (data?.events.length > 0) return <EventsTimeline data={data} />;
	return <EmptyEventsTimeline />;
}
export default function EventsTimelineWithErrorBoundary() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => (
						<ErrorEventsTimeline {...parseErrorMessage(error)} reset={reset} />
					)}
				>
					<Suspense fallback={<LoadingEventsTimeline />}>
						<EventsTimelineWithData reset={reset} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
