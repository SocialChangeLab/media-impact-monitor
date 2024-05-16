"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import { type FiltersStore, createFiltersStore } from "@/stores/filtersStore";

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

export const useFiltersStore = () => {
	const filtersStoreContext = useContext(FiltersStoreContext);

	if (!filtersStoreContext) {
		throw new Error(`useFiltersStore must be use within FiltersStoreProvider`);
	}

	return useStore(filtersStoreContext, (state) => state);
};
