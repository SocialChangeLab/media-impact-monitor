import { create } from "zustand";

export const defaultInitState: UiState = {
	isScrollingUp: false,
	isScrolledToTop: true,
	scrollThresholdConsideredTheTop: 75,
};

export type UiState = {
	isScrollingUp: boolean;
	isScrolledToTop: boolean;
	scrollThresholdConsideredTheTop: number;
};

// export type UiActions = {};

export type UiStore = UiState; // & UiActions;

export const createUiStore = (initState: UiState = defaultInitState) =>
	create<UiStore>(() => initState);
