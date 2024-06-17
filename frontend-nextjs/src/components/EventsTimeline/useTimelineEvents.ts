import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import useTimeScale from "@/utility/useTimeScale";
import { scalePow } from "d3-scale";
import { startOfDay } from "date-fns";
import { useCallback, useMemo } from "react";
import defaultConfig from "./eventsTimelineConfig";
import type { AggregationUnitType } from "./useAggregationUnit";

function useTimelineEvents({
	size,
	data,
	aggregationUnit,
	config = defaultConfig,
	from,
	to,
}: {
	size: { width: number; height: number };
	data: {
		events: ParsedEventType[];
		organisations: OrganisationType[];
	} | null;
	aggregationUnit: AggregationUnitType;
	from?: Date;
	to?: Date;
	config?: {
		eventMinHeight: number;
		eventMaxHeight: number;
		aggregatedEventMaxHeight: number;
	};
}) {
	const intervals = useTimeIntervals({ aggregationUnit, from, to });
	const timeScale = useTimeScale(size.width);
	const columnsCount = intervals.length;
	const isInSameUnit = useCallback(
		(event: ParsedEventType, b: Date) =>
			isInSameAggregationUnit(aggregationUnit, event, b),
		[aggregationUnit],
	);

	const eventColumns = useMemo(() => {
		if (!timeScale || !data?.events || !data?.organisations) return [];
		return intervals.map((d) => {
			const columnEvents = data.events.filter((evt) => isInSameUnit(evt, d));
			const eventsWithSize = columnEvents.sort((a, b) => {
				const aSize = a.size_number ?? 0;
				const bSize = b.size_number ?? 0;
				if (aSize < bSize ?? 0) return -1;
				if (aSize > bSize ?? 0) return 1;
				if (!a.organizers[0] || !b.organizers[0]) return 0;
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
								const organisation = data.organisations.find(
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
	}, [data?.events, timeScale, intervals, isInSameUnit, data?.organisations]);

	const sizeScale = useMemo(() => {
		const displayedEvents = eventColumns.reduce((acc, day) => {
			return acc.concat(day.eventsWithSize);
		}, [] as ParsedEventType[]);
		const max =
			displayedEvents.length === 0
				? Math.floor(size.height / 3)
				: Math.max(
						...(aggregationUnit === "day"
							? displayedEvents.map((e) => e.size_number ?? 0)
							: eventColumns.map((e) => e.sumSize ?? 0)),
					);

		const maxHeight = Math.min(
			aggregationUnit === "day"
				? config.eventMaxHeight
				: config.aggregatedEventMaxHeight,
			size.height,
		);
		return scalePow([0, max], [config.eventMinHeight, maxHeight]);
	}, [eventColumns, aggregationUnit, size.height, config]);

	return {
		eventColumns,
		columnsCount,
		sizeScale,
	};
}

export default useTimelineEvents;
