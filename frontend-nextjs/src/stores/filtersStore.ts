import { format, startOfDay, subMonths } from "date-fns";
import { create } from "zustand";
import {
	createJSONStorage,
	persist,
	type StateStorage,
} from "zustand/middleware";

const defaultTo = startOfDay(new Date());
const defaultFrom = startOfDay(subMonths(defaultTo, 2));

export type FiltersState = {
	from: Date;
	to: Date;
	defaultFrom: Date;
	defaultTo: Date;
	fromDateString: string;
	toDateString: string;
	isDefaultTimeRange: boolean;
};

export type FiltersActions = {
	setDateRange: (props: { from: Date; to: Date }) => void;
	resetAllFilters: () => void;
	resetDateRange: () => void;
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
};

const getUrlSearch = () => {
	if (typeof window === "undefined") return "";
	return window.location.search.slice(1);
};

const persistentStorage: StateStorage = {
	getItem: (key: string): string => {
		const searchParams = new URLSearchParams(getUrlSearch());
		const storedValue = searchParams.get(key);
		const json = JSON.parse(storedValue as string);
		return json;
	},
	setItem: (key, newValue): void => {
		const searchParams = new URLSearchParams(getUrlSearch());
		searchParams.set(key, JSON.stringify(newValue));
		window.history.replaceState(null, "", `?${searchParams.toString()}`);
		localStorage.setItem(key, JSON.stringify(newValue));
	},
	removeItem: (key): void => {
		const searchParams = new URLSearchParams(getUrlSearch());
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
				setDateRange: ({ from, to }) =>
					set(() => ({
						from: startOfDay(from),
						to: startOfDay(to),
						fromDateString: format(from, "yyyy-MM-dd"),
						toDateString: format(to, "yyyy-MM-dd"),
					})),
				resetAllFilters: () => set(() => defaultInitState),
				resetDateRange: () =>
					set(() => ({
						from: defaultInitState.from,
						to: defaultInitState.to,
						fromDateString: defaultInitState.fromDateString,
						toDateString: defaultInitState.toDateString,
					})),
			}),
			storageOptions,
		),
	);
