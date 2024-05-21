"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore, type StoreApi } from "zustand";

import { createFiltersStore, type FiltersStore } from "@/stores/filtersStore";

export const FiltersStoreContext = createContext<StoreApi<FiltersStore> | null>(
	null,
);

export interface FiltersStoreProviderProps {
	children: ReactNode;
	initialState?: FiltersStore;
}

export const FiltersStoreProvider = ({
	children,
	initialState,
}: FiltersStoreProviderProps) => {
	const storeRef = useRef<StoreApi<FiltersStore>>();
	if (!storeRef.current) {
		storeRef.current = createFiltersStore(initialState);
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
