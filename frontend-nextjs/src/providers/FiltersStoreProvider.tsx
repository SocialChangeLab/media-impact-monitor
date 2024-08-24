"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import {
	type FiltersStore,
	createFiltersStore,
	defaultInitState,
} from "@/stores/filtersStore";

export const FiltersStoreContext = createContext<StoreApi<FiltersStore> | null>(
	null,
);

export interface FiltersStoreProviderProps {
	children: ReactNode;
	initialState?: Partial<FiltersStore>;
}

export const FiltersStoreProvider = ({
	children,
	initialState = defaultInitState,
}: FiltersStoreProviderProps) => {
	const storeRef = useRef<StoreApi<FiltersStore>>();
	if (!storeRef.current) {
		storeRef.current = createFiltersStore({
			...defaultInitState,
			...initialState,
		});
	}

	return (
		<FiltersStoreContext.Provider value={storeRef.current}>
			{children}
		</FiltersStoreContext.Provider>
	);
};

export const useFiltersStore = <T,>(
	selector: (store: FiltersStore) => T,
): T => {
	const filtersStoreContext = useContext(FiltersStoreContext);

	if (!filtersStoreContext) {
		throw new Error(`useFiltersStore must be use within FiltersStoreProvider`);
	}

	return useStore(filtersStoreContext, selector);
};
