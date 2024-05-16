import { subDays } from "date-fns";
import { createStore } from "zustand/vanilla";

const defaultTo = new Date();
const defaultFrom = subDays(new Date(), 30);

export type FiltersState = {
	from: Date;
	to: Date;
};

export type FiltersActions = {
	setDateRange: (props: { from: Date; to: Date }) => void;
};

export type FiltersStore = FiltersState & FiltersActions;

export const defaultInitState: FiltersState = {
	from: new Date(defaultFrom),
	to: new Date(defaultTo),
};

export const createFiltersStore = (
	initState: FiltersState = defaultInitState,
) => {
	return createStore<FiltersStore>()((set) => ({
		...initState,
		setDateRange: ({ from, to }) => set(() => ({ from, to })),
	}));
};
