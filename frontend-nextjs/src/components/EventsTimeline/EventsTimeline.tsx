"use client";
import TimelineRouteError from "@/app/(events)/@timeline/error";
import TimelineRouteLoading from "@/app/(events)/@timeline/loading";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useTimeScale from "@/utility/useTimeScale";
import useElementSize from "@custom-react-hooks/use-element-size";
import { scalePow } from "d3-scale";
import { format, startOfDay } from "date-fns";
import { useCallback, useMemo } from "react";
import HeadlineWithLine from "../HeadlineWithLine";
import EmptyEventsTimeline from "./EmptyEventsTimeline";
import EventBubbleLink, { AggregatedEventsBubble } from "./EventBubbleLink";
import EventTooltip from "./EventTooltip";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineOrgsLegend from "./EventsTimelineOrgsLegend";
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
	const { from, to } = useFiltersStore(({ from, to }) => ({ from, to }));
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
	const animationKey = [
		format(from, "yyyy-MM-dd"),
		format(to, "yyyy-MM-dd"),
	].join("-");

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
											"bg-grayLight opacity-50 event-line transition-opacity",
										)}
										aria-hidden="true"
									/>
									{aggregationUnit === "day" &&
										eventsWithSize.map((event) => (
											<EventTimelineItem
												key={event.event_id}
												event={event}
												organisations={organisations}
												sizeScale={sizeScale}
											/>
										))}
									{aggregationUnit !== "day" && eventsWithSize.length > 0 && (
										<div className="rounded-full bg-grayUltraLight">
											<div
												className={cn(
													"size-3 relative z-10 hover:z-20",
													"event-item transition-all",
													combinedOrganizers.map((org) => {
														const isMain = org?.isMain ?? false;
														return `event-item-org-${
															isMain
																? slugifyCssClass(org.name) ||
																	"unknown-organisation"
																: "other"
														}`;
													}),
												)}
												style={{
													height: `${Math.ceil(sizeScale(sumSize ?? 0))}px`,
												}}
											>
												<AggregatedEventsBubble
													organisations={combinedOrganizers}
												/>
											</div>
										</div>
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
			<div className="mt-6 flex flex-col gap-4 w-screen px-6 -ml-6">
				<HeadlineWithLine>Legend</HeadlineWithLine>
				<div className="grid gap-8 md:gap-12 md:grid-cols-[auto_1fr]">
					<EventsTimelineSizeLegend sizeScale={sizeScale} />
					<EventsTimelineOrgsLegend organisations={organisations} />
				</div>
			</div>
		</EventsTimelineWrapper>
	);
}

type EventTimelineItemProps = {
	event: EventType;
	organisations: OrganisationType[];
	sizeScale: (x: number) => number;
};
function EventTimelineItem({
	event,
	organisations,
	sizeScale,
}: EventTimelineItemProps) {
	return (
		<EventTooltip
			key={event.event_id}
			event={event}
			organisations={organisations}
		>
			<div className="rounded-full bg-grayUltraLight">
				<div
					className={cn(
						"size-3 relative z-10 hover:z-20",
						"event-item transition-all",
						event.organizers.map((org) => {
							const correspondingOrg = organisations.find(
								(organisation) => organisation.name === org,
							);
							const isMain = correspondingOrg?.isMain ?? false;
							return `event-item-org-${
								isMain
									? slugifyCssClass(org) || "unknown-organisation"
									: "other"
							}`;
						}),
					)}
					style={{
						height: `${Math.ceil(sizeScale(event.size_number ?? 0))}px`,
					}}
				>
					<EventBubbleLink event={event} organisations={organisations} />
				</div>
			</div>
		</EventTooltip>
	);
}

function EventsTimelineAggregatedItem({
	height,
	organisations,
	events,
}: {
	height: number;
	organisations: OrganisationType[];
	events: EventType[];
}) {
	return (
		<div className="rounded-full bg-grayUltraLight">
			<div
				className={cn(
					"size-3 relative z-10 hover:z-20",
					"event-item transition-all",
					organisations.map((org) => {
						const isMain = org?.isMain ?? false;
						return `event-item-org-${
							isMain
								? slugifyCssClass(org.name) || "unknown-organisation"
								: "other"
						}`;
					}),
				)}
				style={{
					height: `${height}px`,
				}}
			>
				<AggregatedEventsBubble organisations={organisations} />
			</div>
		</div>
	);
}

export default function EventsTimelineWithData({
	data: initialData,
}: {
	data: EventType[];
}) {
	const { data, isPending, error } = useEvents(initialData);
	if (isPending) return <TimelineRouteLoading />;
	if (error) return <TimelineRouteError error={error} />;
	return <EventsTimeline data={data} />;
}
