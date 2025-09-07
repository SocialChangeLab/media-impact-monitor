import { getDatasetRange } from "@/providers/TodayProvider";
import { format } from "@/utility/dateUtil";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import {
	endOfDay,
	isAfter,
	isBefore,
	isValid,
	parse,
	startOfDay,
	subDays,
	subMonths
} from "date-fns";
import { z } from "zod";
import { create } from "zustand";
import {
	type StateStorage,
	createJSONStorage,
	persist,
} from "zustand/middleware";


export type MediaSourceType = "news_online" | "news_print" | "social_tiktok" | "web_google";
export type TopicType = "climate_change" | "gaza_crisis";

export type FiltersState = {
	from: Date;
	to: Date;
	defaultFrom: Date;
	defaultTo: Date;
	fromDateString: string;
	toDateString: string;
	isDefaultTimeRange: boolean;
	organizers: EventOrganizerSlugType[];
	mediaSource: MediaSourceType;
	topic: TopicType;
};

export type FiltersActions = {
	setDateRange: (props: { from: Date; to: Date }) => void;
	resetAllFilters: () => void;
	resetDateRange: () => void;
	setOrganizers: (organizers: EventOrganizerSlugType[]) => void;
	setMediaSource: (mediaSource: MediaSourceType) => void;
	setTopic: (topic: TopicType) => void;
};

export type FiltersStore = FiltersState & FiltersActions;

export const getDefaultInitState = (today: Date): FiltersState => {
	const defaultTo = endOfDay(subDays(today, 1));
	const defaultFrom = startOfDay(subMonths(startOfDay(today), 2));
	return {
		from: defaultFrom,
		to: defaultTo,
		defaultFrom: defaultFrom,
		defaultTo: defaultTo,
		fromDateString: format(defaultFrom, "yyyy-MM-dd"),
		toDateString: format(defaultTo, "yyyy-MM-dd"),
		isDefaultTimeRange: true,
		organizers: [] as EventOrganizerSlugType[],
		mediaSource: "news_online",
		topic: "climate_change",
	};
}

const preprossedDate = z.preprocess((arg) => {
	if (typeof arg !== 'string') return arg;
	if (arg.length === 10) return parse(arg, "yyyy-MM-dd", new Date());
	return new Date(arg);
}, z.date())

const getFiltersZodSchema = (today: Date) => {
	const defaultInitState = getDefaultInitState(today);
	return z
	.object({
		from: preprossedDate,
		to: preprossedDate,
		defaultFrom: z.preprocess(() => defaultInitState.defaultFrom, z.date()),
		defaultTo: z.preprocess(() => defaultInitState.defaultTo, z.date()),
		fromDateString: z.string(),
		toDateString: z.string(),
		isDefaultTimeRange: z
			.boolean()
			.default(defaultInitState.isDefaultTimeRange),
		organizers: z.array(z.string()).default(defaultInitState.organizers),
		mediaSource: z.enum(["news_online", "news_print", "social_tiktok", "web_google"]),
		topic: z.enum(["climate_change", "gaza_crisis"]).default(defaultInitState.topic),
	})
	.default(defaultInitState);
}

const getUrlSearch = (today: Date = new Date()) => {
	if (typeof window === "undefined") return new URLSearchParams();
	const searchParamsString = window.location.search.slice(1);
	const searchParams = new URLSearchParams(searchParamsString);
	const filters = searchParams.get("filters");
	const zodSchema = getFiltersZodSchema(today);
	const defaultInitState = getDefaultInitState(today);
	let state = defaultInitState;
	try {
		state = z
			.object({ state: zodSchema })
			.parse(JSON.parse(filters || `"{\\"state\\":{}}"`))
			.state as FiltersState;
	} catch (err) {
		console.error(err);
	} 
	const newJSONState = { ...state, ...limitDateRange({ ...state, today}) };
	searchParams.set(
		"filters",
		JSON.stringify(
			JSON.stringify({
				state: {
					...newJSONState,
					from: format(newJSONState.from, "yyyy-MM-dd"),
					to: format(newJSONState.to, "yyyy-MM-dd"),
					defaultFrom: format(newJSONState.defaultFrom, "yyyy-MM-dd"),
					defaultTo: format(newJSONState.defaultTo, "yyyy-MM-dd"),
				},
			}),
		),
	);
	return searchParams;
};

const getPersistentStorage = (today: Date): StateStorage => ({
	getItem: (key: string): string => {
		const searchParams = getUrlSearch(today);
		const storedValue = searchParams.get(key);
		return JSON.parse(storedValue as string);
	},
	setItem: (key, newValue): void => {
		const searchParams = getUrlSearch(today);
		try {
			const existingValue = JSON.parse(JSON.parse(searchParams.get(key) as string));
			const newParsedValue = JSON.parse(newValue);
			const mergedValue = { state: { ...existingValue.state, ...newParsedValue.state } };
			searchParams.set(key, JSON.stringify(mergedValue));
		} catch(err) {
			console.error(err);
		}
		window.history.replaceState(null, "", `?${searchParams.toString()}`);
		localStorage.setItem(key, JSON.stringify(newValue));
	},
	removeItem: (key): void => {
		const searchParams = getUrlSearch(today);
		searchParams.delete(key);
		window.location.search = searchParams.toString();
	},
});

const getStorageOptions = (today: Date) => ({
	name: "filters",
	storage: createJSONStorage<FiltersStore>(() => getPersistentStorage(today)),
});

export const createFiltersStore = (
	today: Date,
	initState: FiltersState = getDefaultInitState(today),
) => {
	const defaultInitState = getDefaultInitState(today);
	return create(
		persist<FiltersStore>(
			(set) => ({
				...defaultInitState,
				...initState,
				setDateRange: (range) =>
					set(() =>
						limitDateRange({
							from: range.from,
							to: range.to,
							today,
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
				setOrganizers: (organizers: EventOrganizerSlugType[]) =>
					set(() => ({ organizers })),
				setMediaSource: (mediaSource: MediaSourceType) =>
					set(() => ({ mediaSource })),
				setTopic: (topic: TopicType) =>
					set(() => ({ topic })),
			}),
			getStorageOptions(today),
		),
	);
}

export function limitDateRange({ from, to, today }: { from: Date; to: Date; today: Date; }) {
	const { datasetStartDate, datasetEndDate } = getDatasetRange(today);
	const defaultInitState = getDefaultInitState(today);
	const validFrom = isValid(from) ? from : defaultInitState.from;
	const validTo = isValid(to) ? to : defaultInitState.to;
	const newFrom = isBefore(validFrom, datasetStartDate) ? datasetStartDate : validFrom;
	const newTo = isAfter(validTo, datasetEndDate) ? datasetEndDate : validTo;
	const earliestDate = isBefore(newFrom, newTo) ? newFrom : newTo;
	const latestDate = isAfter(newFrom, newTo) ? newFrom : newTo;
	return {
		from: earliestDate,
		to: latestDate,
		fromDateString: format(earliestDate, "yyyy-MM-dd"),
		toDateString: format(latestDate, "yyyy-MM-dd"),
	};
}
