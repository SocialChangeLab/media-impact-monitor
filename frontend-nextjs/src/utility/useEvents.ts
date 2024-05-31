"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useSuspenseQuery } from "@tanstack/react-query";
import { endOfDay, format, isAfter, isBefore } from "date-fns";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
	type EventType,
	type OrganisationType,
	getEventsData,
} from "./eventsUtil";

function useEvents() {
	const { from, to } = useFiltersStore(({ from, to }) => ({
		from,
		to,
	}));
	const fromDateString = format(from, "yyyy-MM-dd");
	const toDateString = format(to, "yyyy-MM-dd");
	const queryKey = ["events", fromDateString, toDateString];
	const query = useSuspenseQuery({
		queryKey,
		queryFn: async () => await getEventsData({ from, to }),
		staleTime: endOfDay(new Date()).getTime() - new Date().getTime(),
	});
	const { data, isPending, error } = query;

	useEffect(() => {
		if (!error) return;
		toast.error(`Error fetching events: ${error}`, {
			important: true,
			dismissible: false,
			duration: 1000000,
		});
	}, [error]);

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
		...query,
		data: { events, organisations },
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
