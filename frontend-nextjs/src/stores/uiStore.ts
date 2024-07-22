import { create } from "zustand";

export const scrollThresholdConsideredTheTop = 75;
export const filtersAreaHeightDesktop = 137;

export const defaultInitState: UiState = {
	isScrollingUp: false,
	isScrolledToTop: true,
	scrollThresholdConsideredTheTop,
	filtersAreaHeightDesktop,
};

export type UiState = {
	isScrollingUp: boolean;
	isScrolledToTop: boolean;
	scrollThresholdConsideredTheTop: number;
	filtersAreaHeightDesktop: number;
};

// export type UiActions = {};

export type UiStore = UiState; // & UiActions;

export const createUiStore = (initState: UiState = defaultInitState) =>
	create<UiStore>(() => initState);
