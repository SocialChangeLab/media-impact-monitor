"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import {
	type FiltersStore,
	createFiltersStore,
	getDefaultInitState,
} from "@/stores/filtersStore";

export const FiltersStoreContext = createContext<StoreApi<FiltersStore> | null>(
	null,
);

export interface FiltersStoreProviderProps {
	children: ReactNode;
	initialState?: Partial<FiltersStore>;
	today: Date;
}

export const FiltersStoreProvider = ({
	children,
	today,
	initialState
}: FiltersStoreProviderProps) => {
	const defaultInitState = getDefaultInitState(today);
	const storeRef = useRef<StoreApi<FiltersStore>>();
	if (!storeRef.current) {
		storeRef.current = createFiltersStore(today, {
			...defaultInitState,
			...(initialState || {}),
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
