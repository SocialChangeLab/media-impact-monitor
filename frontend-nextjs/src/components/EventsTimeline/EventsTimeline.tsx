"use client";
import LoadingEventsTimeline from "@/components/EventsTimeline/LoadingEventsTimeline";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useTimeScale from "@/utility/useTimeScale";
import useElementSize from "@custom-react-hooks/use-element-size";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { scalePow } from "d3-scale";
import { startOfDay } from "date-fns";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense, useCallback, useMemo } from "react";
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
import config from "./eventsTimelineConfig";
import useAggregationUnit from "./useAggregationUnit";

function EventsTimeline({
	data,
}: {
	data: {
		events: EventType[];
		organisations: OrganisationType[];
	};
}) {
	const [parentRef, size] = useElementSize();
	const aggregationUnit = useAggregationUnit(size.width);
	const intervals = useTimeIntervals(aggregationUnit);
	const { events, organisations } = data;

	const timeScale = useTimeScale(size.width);

	const columnsCount = intervals.length;

	const isInSameUnit = useCallback(
		(a: Date, b: Date) => isInSameAggregationUnit(aggregationUnit, a, b),
		[aggregationUnit],
	);

	const eventColumns = useMemo(() => {
		if (!timeScale) return [];
		return intervals.map((d) => {
			const columnEvents = events.filter((evt) =>
				isInSameUnit(new Date(evt.date), d),
			);
			const eventsWithSize = columnEvents.sort((a, b) => {
				const aSize = a.size_number ?? 0;
				const bSize = b.size_number ?? 0;
				if (aSize < bSize ?? 0) return -1;
				if (aSize > bSize ?? 0) return 1;
				return a.organizers[0].localeCompare(b.organizers[0]);
			});

			return {
				day: startOfDay(d),
				eventsWithSize,
				sumSize: columnEvents.reduce((acc, evt) => {
					return acc + (evt.size_number ?? 0);
				}, 0),
				combinedOrganizers: Array.from(
					columnEvents
						.reduce((acc, evt) => {
							for (const orgName of evt.organizers) {
								const organisation = organisations.find(
									(o) => o.name === orgName,
								);
								if (organisation) acc.set(orgName, organisation);
							}
							return acc;
						}, new Map<string, OrganisationType>())
						.values(),
				),
			};
		});
	}, [events, timeScale, intervals, isInSameUnit, organisations]);

	const sizeScale = useMemo(() => {
		const displayedEvents = eventColumns.reduce((acc, day) => {
			return acc.concat(day.eventsWithSize);
		}, [] as EventType[]);
		const max =
			displayedEvents.length === 0
				? 100
				: Math.max(
						...(aggregationUnit === "day"
							? displayedEvents.map((e) => e.size_number ?? 0)
							: eventColumns.map((e) => e.sumSize ?? 0)),
					);

		const maxHeight =
			aggregationUnit === "day"
				? config.eventMaxHeight
				: config.aggregatedEventMaxHeight;
		return scalePow([0, max], [config.eventMinHeight, maxHeight]);
	}, [eventColumns, aggregationUnit]);

	if (events.length === 0) return <EmptyEventsTimeline />;

	return (
		<EventsTimelineWrapper organisations={organisations} ref={parentRef}>
			<EventsTimelineScrollWrapper>
				<EventsTimelineChartWrapper columnsCount={columnsCount + 1}>
					{eventColumns.map(
						({ day, eventsWithSize, sumSize, combinedOrganizers }) => (
							<li
								key={`event-day-${day.toISOString()}`}
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
											date={day}
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
						<OrgsLegend organisations={organisations} />
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

function EventsTimelineWithData() {
	const { data, isFetching } = useEvents();
	if (isFetching) return <LoadingEventsTimeline />;
	if (data) return <EventsTimeline data={data} />;
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
						<EventsTimelineWithData />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
