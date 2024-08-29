"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import {
	type UiStore,
	createUiStore,
	defaultInitState,
} from "@/stores/uiStore";
import useDebounce from "@custom-react-hooks/use-debounce";
import { useAnimationFrame } from "framer-motion";

export const UiStoreContext = createContext<StoreApi<UiStore> | null>(null);

export interface UiStoreProviderProps {
	children: ReactNode;
	initialState?: UiStore;
}

export const UiStoreProvider = ({
	children,
	initialState,
}: UiStoreProviderProps) => {
	const storeRef = useRef<StoreApi<UiStore>>();
	if (!storeRef.current) {
		storeRef.current = createUiStore(initialState);
	}

	return (
		<UiStoreContext.Provider value={storeRef.current}>
			{children}
		</UiStoreContext.Provider>
	);
};

export const useUiStore = <T,>(selector: (store: UiStore) => T): T => {
	const filtersStoreContext = useContext(UiStoreContext);
	const lastScroll = useRef<number>(0);

	const [updateView] = useDebounce(
		() => {
			if (typeof window === "undefined" || typeof document === "undefined")
				return;
			if (!filtersStoreContext) return;
			const header = document.getElementById("main-navigation");
			const headerHeight =
				Math.floor(header?.getBoundingClientRect().height ?? 76) - 1;
			const currentScroll =
				window.scrollY ??
				document.documentElement.scrollTop ??
				document.body.scrollTop ??
				0;
			const lastScrollValue = lastScroll.current;
			lastScroll.current = currentScroll;

			const { isScrollingUp, isScrolledToTop } =
				filtersStoreContext.getState() || defaultInitState;

			const newIsScrolledToTop = currentScroll <= headerHeight;
			if (isScrolledToTop !== newIsScrolledToTop) {
				filtersStoreContext.setState({ isScrolledToTop: newIsScrolledToTop });
			}

			if (currentScroll === lastScrollValue) return;
			const newIsScrollingUp = currentScroll < lastScrollValue;
			if (newIsScrollingUp === isScrollingUp) return;

			filtersStoreContext.setState({
				isScrollingUp: currentScroll < lastScrollValue,
			});
		},
		100,
		{ maxWait: 200 },
	);

	useAnimationFrame(updateView);

	if (!filtersStoreContext) {
		throw new Error(`useUiStore must be use within UiStoreProvider`);
	}

	return useStore(filtersStoreContext, selector);
};
