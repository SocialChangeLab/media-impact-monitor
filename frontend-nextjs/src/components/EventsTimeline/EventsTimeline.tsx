"use client";
import TimelineRouteError from "@/app/(events)/@timeline/error";
import TimelineRouteLoading from "@/app/(events)/@timeline/loading";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import useDays from "@/utility/useDays";
import useEvents from "@/utility/useEvents";
import useTimeScale from "@/utility/useTimeScale";
import { scalePow } from "d3-scale";
import { isSameDay, startOfDay } from "date-fns";
import { useMemo } from "react";
import EmptyEventsTimeline from "./EmptyEventsTimeline";
import EventBubbleLink from "./EventBubbleLink";
import EventTooltip from "./EventTooltip";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineLegend from "./EventsTimelineLegend";
import EventsTimelineScrollWrapper from "./EventsTimelineScrollWrapper";

export const config = {
	eventMinHeight: 12,
	eventMaxHeight: 100,
};

function EventsTimeline({
	data,
}: {
	data: {
		events: EventType[];
		organisations: OrganisationType[];
	};
}) {
	const { from, to } = useFiltersStore();
	const days = useDays();
	const { events, organisations } = data;

	const timeScale = useTimeScale();

	const timeDiffInDays = days.length;

	const eventDays = useMemo(() => {
		if (!timeScale) return [];
		return days.map((d) => {
			const eventsOfTheDay = events.filter((evt) => isSameDay(evt.date, d));
			const eventsWithSize = eventsOfTheDay.sort((a, b) => {
				const aSize = a.size_number ?? 0;
				const bSize = b.size_number ?? 0;
				if (aSize < bSize ?? 0) return -1;
				if (aSize > bSize ?? 0) return 1;
				return a.organizers[0].localeCompare(b.organizers[0]);
			});

			return {
				day: startOfDay(d),
				eventsWithSize,
			};
		});
	}, [events, timeScale, days]);

	const sizeScale = useMemo(() => {
		const displayedEvents = eventDays.reduce((acc, day) => {
			return acc.concat(day.eventsWithSize);
		}, [] as EventType[]);
		const max =
			displayedEvents.length === 0
				? 100
				: Math.max(...displayedEvents.map((e) => e.size_number ?? 0));
		return scalePow([0, max], [config.eventMinHeight, config.eventMaxHeight]);
	}, [eventDays]);

	if (events.length === 0) return <EmptyEventsTimeline />;
	const animationKey = [from?.toISOString(), to?.toISOString()].join("-");
	return (
		<EventsTimelineWrapper organisations={organisations}>
			<EventsTimelineScrollWrapper
				animationKey={`${animationKey}-scoll-parent`}
			>
				<EventsTimelineChartWrapper
					columnsCount={timeDiffInDays + 1}
					animationKey={`${animationKey}-chart-wrapper`}
				>
					{eventDays.map(({ day, eventsWithSize }) => (
						<li
							key={`event-day-${day.toISOString()}`}
							className="grid grid-rows-subgrid row-span-3 relative w-4 grow shrink-0"
						>
							<div className="flex flex-col justify-end items-center gap-0.5">
								<div
									className="w-px h-full absolute top-0 left-1/2 -translate-x-1/2 bg-grayLight opacity-50"
									aria-hidden="true"
								/>
								{eventsWithSize.map((event) => (
									<EventTimelineItem
										key={event.event_id}
										event={event}
										organisations={organisations}
										sizeScale={sizeScale}
									/>
								))}
							</div>
						</li>
					))}
				</EventsTimelineChartWrapper>
				<EventsTimelineAxis eventDays={eventDays} />
			</EventsTimelineScrollWrapper>
			<EventsTimelineLegend organisations={organisations} />
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
			<div
				className={cn(
					"size-3 relative z-10 hover:z-20",
					"event-item transition-opacity",
					event.organizers.map((org) => {
						const correspondingOrg = organisations.find(
							(organisation) => organisation.name === org,
						);
						const isMain = correspondingOrg?.isMain ?? false;
						return `event-item-org-${
							isMain ? slugifyCssClass(org) || "unknown-organisation" : "other"
						}`;
					}),
				)}
				style={{
					height: `${Math.ceil(sizeScale(event.size_number ?? 0))}px`,
				}}
			>
				<EventBubbleLink event={event} organisations={organisations} />
			</div>
		</EventTooltip>
	);
}

export default function EventsTimelineWithData({
	data: initialData,
}: {
	data: { events: EventType[]; organisations: OrganisationType[] };
}) {
	const { data, isPending, error } = useEvents(initialData);
	if (isPending) return <TimelineRouteLoading />;
	if (error) return <TimelineRouteError error={error} />;
	return <EventsTimeline data={data} />;
}
