"use client";
import { useUiStore } from "@/providers/UiStoreProvider";
import { usePathname } from "next/navigation";
import FiltersArea from "../FiltersArea";
import HeaderMenu, { doesPathnameShowAnyFilter } from "./HeaderMenu";
import { StickyMenuWrapper } from "./StickyMenuWrapper";

export const Menu = ({ currentPage }: { currentPage: string }) => {
	const pathname = usePathname();
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
			{doesPathnameShowAnyFilter(pathname) && (
				<FiltersArea isScrolledToTop={uiState.isScrolledToTop} />
			)}
		</StickyMenuWrapper>
	);
};
