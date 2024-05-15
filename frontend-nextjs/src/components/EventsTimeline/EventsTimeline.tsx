"use client";
import { fadeVariants, scaleInVariants } from "@/utility/animationUtil";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import useTimeScale from "@/utility/useTimeScale";
import { scalePow } from "d3-scale";
import { addDays, differenceInDays, isSameDay, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { useMemo } from "react";
import EmptyEventsTimeline from "./EmptyEventsTimeline";
import EventBubbleLink from "./EventBubbleLink";
import EventTooltip from "./EventTooltip";
import EventsTimelineWrapper from "./EventsTimelinWrapper";
import EventsTimelineAxis from "./EventsTimelineAxis";
import EventsTimelineChartWrapper from "./EventsTimelineChartWrapper";
import EventsTimelineLegend from "./EventsTimelineLegend";

export const config = {
	eventMinHeight: 12,
	eventMaxHeight: 100,
};

function EventsTimeline() {
	const { from, to, isPending, data } = useEvents();
	const { events, organisations } = data;

	const timeScale = useTimeScale();

	const timeDiffInDays = useMemo(
		() => Math.abs(differenceInDays(addDays(to, 1), from)),
		[from, to],
	);

	const eventDays = useMemo(() => {
		if (!timeScale) return [];
		return (timeScale.ticks(timeDiffInDays) ?? []).map((d) => {
			const eventsOfTheDay = events.filter((evt) => isSameDay(evt.date, d));
			const eventsWithSize = eventsOfTheDay.sort((a, b) =>
				a.organizers[0]?.localeCompare(b.organizers[0]),
			);

			return {
				day: startOfDay(d),
				eventsWithSize,
			};
		});
	}, [events, timeDiffInDays, timeScale]);

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
	return (
		<EventsTimelineWrapper organisations={organisations}>
			<EventsTimelineChartWrapper
				animationKey={[
					from?.toISOString(),
					to?.toISOString(),
					isPending.toString(),
				].join("-")}
				columnsCount={timeDiffInDays + 1}
			>
				{eventDays.map(({ day, eventsWithSize }) => (
					<motion.li
						key={`event-day-${day.toISOString()}`}
						className="grid grid-rows-subgrid row-span-3 relative"
						variants={fadeVariants}
						transition={{ staggerChildren: 0.01 }}
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
					</motion.li>
				))}
			</EventsTimelineChartWrapper>
			<EventsTimelineAxis eventDays={eventDays} />
			<EventsTimelineLegend />
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
			<motion.div
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
				variants={scaleInVariants}
			>
				<EventBubbleLink event={event} organisations={organisations} />
			</motion.div>
		</EventTooltip>
	);
}

export default EventsTimeline;
