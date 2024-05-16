import { defaultFrom, defaultTo } from "@/app/(events)/config";
import { createStore } from "zustand/vanilla";

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
		setDateRange: () => set((state) => ({ from: state.from, to: state.to })),
	}));
};
