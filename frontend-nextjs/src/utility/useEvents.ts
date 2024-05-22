"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	type EventType,
	type OrganisationType,
	getEventsData,
} from "./eventsUtil";

function useEvents(initialData?: Awaited<ReturnType<typeof getEventsData>>) {
	const filtersStore = useFiltersStore(({ from, to, setDateRange }) => ({
		from,
		to,
		setDateRange,
	}));

	const [from, setFrom] = useState(filtersStore.from);
	const [to, setTo] = useState(filtersStore.to);
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["events", fromDateString, toDateString];
	const { data, isPending, error } = useQuery<EventType[], Error>({
		queryKey,
		queryFn: async () => await getEventsData({ from, to }),
		initialData: initialData,
	});

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching events: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

	useEffect(() => {
		setFrom(filtersStore.from);
		setTo(filtersStore.to);
	}, [filtersStore.from, filtersStore.to]);

	const setDateRange = useCallback(
		({ from, to }: { from: Date; to: Date }) => {
			setFrom(from);
			setTo(to);
			filtersStore.setDateRange({ from, to });
		},
		[filtersStore.setDateRange],
	);

	const events = useMemo(() => {
		return (data ?? []).filter((e) => {
			if (!e.date) return false;
			const beforeFrom = isBefore(e.date, from);
			const afterTo = isAfter(e.date, to);
			if (beforeFrom || afterTo) return false;
			return true;
		});
	}, [data, from, to]);

	const organisations = useMemo(
		() => extractEventOrganisations(events),
		[events],
	);

	return {
		data: { events, organisations },
		isPending,
		error: error,
		from,
		to,
		setDateRange,
	};
}

export default useEvents;

const distinctiveColors = [
	`var(--categorical-color-1)`,
	`var(--categorical-color-2)`,
	`var(--categorical-color-3)`,
	`var(--categorical-color-4)`,
	`var(--categorical-color-5)`,
	`var(--categorical-color-6)`,
	`var(--categorical-color-7)`,
	`var(--categorical-color-8)`,
	`var(--categorical-color-9)`,
	`var(--categorical-color-10)`,
	`var(--categorical-color-11)`,
	`var(--categorical-color-12)`,
	"var(--categorical-color-13)",
	"var(--categorical-color-14)",
];

function extractEventOrganisations(events: EventType[]): OrganisationType[] {
	const organisationStrings = [
		...events
			.reduce((acc, event) => {
				for (const organizer of event.organizers ?? []) acc.add(organizer);
				return acc;
			}, new Set<string>())
			.values(),
	];
	return organisationStrings
		.map((organizer) => ({
			name: organizer,
			count: events.filter((x) => x.organizers?.includes(organizer)).length,
		}))
		.sort((a, b) => b.count - a.count)
		.map((organizer, idx) => {
			if (organizer.name.toLocaleLowerCase().trim() === "") {
				return {
					name: "Unknown organisation",
					color: "var(--grayMed)",
					count: events.filter((x) => x.organizers?.filter((x) => !x)).length,
					isMain: false,
				};
			}
			const color = distinctiveColors[idx];
			return {
				...organizer,
				color: color ?? "var(--grayDark)",
				isMain: idx < distinctiveColors.length,
			};
		});
}
