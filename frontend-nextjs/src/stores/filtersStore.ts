import type { OrganisationType } from "@/utility/eventsUtil";
import {
	endOfDay,
	format,
	isAfter,
	isBefore,
	parse,
	startOfDay,
	subDays,
	subMonths,
} from "date-fns";
import { z } from "zod";
import { create } from "zustand";
import {
	type StateStorage,
	createJSONStorage,
	persist,
} from "zustand/middleware";

const defaultTo = endOfDay(subDays(new Date(), 1));
const defaultFrom = startOfDay(subMonths(startOfDay(new Date()), 2));

export type FiltersState = {
	from: Date;
	to: Date;
	defaultFrom: Date;
	defaultTo: Date;
	fromDateString: string;
	toDateString: string;
	isDefaultTimeRange: boolean;
	organizers: OrganisationType["name"][];
};

export type FiltersActions = {
	setDateRange: (props: { from: Date; to: Date }) => void;
	resetAllFilters: () => void;
	resetDateRange: () => void;
	setOrganizers: (organizers: OrganisationType["name"][]) => void;
};

export type FiltersStore = FiltersState & FiltersActions;

export const defaultInitState: FiltersState = {
	from: defaultFrom,
	to: defaultTo,
	defaultFrom: defaultFrom,
	defaultTo: defaultTo,
	fromDateString: format(defaultFrom, "yyyy-MM-dd"),
	toDateString: format(defaultTo, "yyyy-MM-dd"),
	isDefaultTimeRange: true,
	organizers: ["Fridays for Future", "Extinction Rebellion"],
};

const filtersZodSchema = z
	.object({
		from: z.coerce.date().default(defaultInitState.from),
		to: z.coerce.date().default(defaultInitState.to),
		defaultFrom: z.coerce.date().default(defaultInitState.defaultFrom),
		defaultTo: z.coerce.date().default(defaultInitState.defaultTo),
		fromDateString: z.string().default(defaultInitState.fromDateString),
		toDateString: z.string().default(defaultInitState.toDateString),
		isDefaultTimeRange: z
			.boolean()
			.default(defaultInitState.isDefaultTimeRange),
	})
	.default(defaultInitState);

const getUrlSearch = () => {
	if (typeof window === "undefined") return new URLSearchParams();
	const searchParamsString = window.location.search.slice(1);
	const searchParams = new URLSearchParams(searchParamsString);
	const filters = searchParams.get("filters");
	const parsingResult = z
		.object({ state: filtersZodSchema })
		.safeParse(JSON.parse(JSON.parse(filters || `"{\\"state\\":{}}"`)));
	const state = parsingResult.success
		? parsingResult.data.state
		: defaultInitState;
	const newJSONState = { ...state, ...limitDateRange(state) };
	searchParams.set(
		"filters",
		JSON.stringify(
			JSON.stringify({
				state: {
					...newJSONState,
					from: newJSONState.from.toISOString(),
					to: newJSONState.to.toISOString(),
					defaultFrom: newJSONState.defaultFrom.toISOString(),
					defaultTo: newJSONState.defaultTo.toISOString(),
				},
			}),
		),
	);
	return searchParams;
};

const persistentStorage: StateStorage = {
	getItem: (key: string): string => {
		const searchParams = getUrlSearch();
		const storedValue = searchParams.get(key);
		return JSON.parse(storedValue as string);
	},
	setItem: (key, newValue): void => {
		const searchParams = getUrlSearch();
		searchParams.set(key, JSON.stringify(newValue));
		window.history.replaceState(null, "", `?${searchParams.toString()}`);
		localStorage.setItem(key, JSON.stringify(newValue));
	},
	removeItem: (key): void => {
		const searchParams = getUrlSearch();
		searchParams.delete(key);
		window.location.search = searchParams.toString();
	},
};

const storageOptions = {
	name: "filters",
	storage: createJSONStorage<FiltersStore>(() => persistentStorage),
};

export const createFiltersStore = (
	initState: FiltersState = defaultInitState,
) =>
	create(
		persist<FiltersStore>(
			(set) => ({
				...initState,
				setDateRange: (range) =>
					set(() =>
						limitDateRange({
							from: startOfDay(range.from),
							to: endOfDay(range.to),
						}),
					),
				resetAllFilters: () => set(() => defaultInitState),
				resetDateRange: () =>
					set(() => ({
						from: defaultInitState.from,
						to: defaultInitState.to,
						fromDateString: defaultInitState.fromDateString,
						toDateString: defaultInitState.toDateString,
					})),
				setOrganizers: (organizers: OrganisationType["name"][]) =>
					set(() => ({ organizers })),
			}),
			storageOptions,
		),
	);

export const datasetStartDate = startOfDay(
	parse("01-01-2020", "dd-MM-yyyy", new Date()),
);
export const datasetEndDate = endOfDay(subDays(new Date(), 1));

export function limitDateRange({ from, to }: { from: Date; to: Date }) {
	const newFrom = isBefore(from, datasetStartDate) ? datasetStartDate : from;
	const newTo = isAfter(to, datasetEndDate) ? datasetEndDate : to;
	return {
		from: newFrom,
		to: newTo,
		fromDateString: format(newFrom, "yyyy-MM-dd"),
		toDateString: format(newTo, "yyyy-MM-dd"),
	};
}
