import { ComparableDateItemType } from "@/utility/comparableDateItemSchema";
import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
import { useAllEvents } from "@/utility/useEvents";
import { useAllOrganisations, useSelectedOrganisations } from "@/utility/useOrganisations";
import useTimeIntervals, {
	isInSameAggregationUnit,
} from "@/utility/useTimeIntervals";
import { scalePow } from "d3-scale";
import { useCallback, useMemo } from "react";
import defaultConfig from "./eventsTimelineConfig";
import type { AggregationUnitType } from "./useAggregationUnit";

function combineOrganizers(
	events: ParsedEventType[],
	organisations: OrganisationType[],
) {
	return Array.from(
		events
			.reduce((acc, evt) => {
				const orgs = evt.organizers.filter((org) =>
					organisations.find((o) => o.slug === org.slug),
				);
				for (const org of orgs) {
					const organisation = organisations.find((o) => o.slug === org.slug);
					if (organisation) acc.set(org.slug, organisation);
				}
				return acc;
			}, new Map<string, OrganisationType>())
			.values(),
	);
}

function useTimelineEvents({
	size,
	aggregationUnit,
	config = defaultConfig,
	from,
	to,
}: {
	size: { width: number; height: number };
	aggregationUnit: AggregationUnitType;
	from?: Date;
	to?: Date;
	config?: {
		eventMinHeight: number;
		eventMaxHeight: number;
		aggregatedEventMaxHeight: number;
	};
}) {
	const { allEvents } = useAllEvents();
	const { organisations } = useAllOrganisations();
	const { selectedOrganisations } = useSelectedOrganisations();
	const intervals = useTimeIntervals({ aggregationUnit, from, to });
	const columnsCount = intervals.length;
	const isInSameUnit = useCallback(
		(event: ParsedEventType, b: ComparableDateItemType) =>
			isInSameAggregationUnit(aggregationUnit, event, b),
		[aggregationUnit],
	);

	const eventColumnsWithoutOrgs = useMemo(() => {
		if (!allEvents) return [];
		return intervals.map((comparableDateObject) => {
			const columnEvents = allEvents.filter((evt) => {
				const isInUnit = isInSameUnit(evt, comparableDateObject)
				if (!isInUnit || selectedOrganisations.length === 0) return false
				return selectedOrganisations.find((org) => evt.organizers.find((x) => x.slug === org.slug))
			});
			const eventsWithSize = columnEvents.sort((a, b) => {
				const aSize = a.size_number ?? 0;
				const bSize = b.size_number ?? 0;
				if (aSize < bSize ?? 0) return -1;
				if (aSize > bSize ?? 0) return 1;
				if (!a.organizers[0] || !b.organizers[0]) return 0;
				return a.organizers[0].name.localeCompare(b.organizers[0].name);
			});

			return {
				...comparableDateObject,
				eventsWithSize,
				sumSize: columnEvents.reduce((acc, evt) => {
					return acc + (evt.size_number ?? 0);
				}, 0),
				columnEvents,
			}
		})
	}, [allEvents, selectedOrganisations, intervals, isInSameUnit])

	const eventColumns = useMemo(() => {
		if (!organisations) return [];
		return eventColumnsWithoutOrgs.map((d) => ({
			...d,
			combinedOrganizers: combineOrganizers(d.columnEvents, organisations),
			combinedSelectedOrganizers: combineOrganizers(
				d.columnEvents,
				selectedOrganisations,
			),
		}));
	}, [organisations, selectedOrganisations, eventColumnsWithoutOrgs]);

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
