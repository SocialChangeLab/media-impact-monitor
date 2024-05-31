"use client";
import { useUiStore } from "@/providers/UiStoreProvider";
import FiltersArea from "../FiltersArea";
import HeaderMenu from "./HeaderMenu";
import { StickyMenuWrapper } from "./StickyMenuWrapper";

export const Menu = ({ currentPage }: { currentPage: string }) => {
	const uiState = useUiStore(
		({ isScrolledToTop, isScrollingUp, scrollThresholdConsideredTheTop }) => ({
			isScrolledToTop,
			isScrollingUp,
			scrollThresholdConsideredTheTop,
		}),
	);
	return (
		<StickyMenuWrapper {...uiState}>
			<HeaderMenu currentPage={currentPage} />
			<FiltersArea />
		</StickyMenuWrapper>
	);
};
