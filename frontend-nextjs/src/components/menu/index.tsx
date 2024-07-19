"use client";
import FiltersArea from "../FiltersArea";
import HeaderMenu from "./HeaderMenu";
import { StickyMenuWrapper } from "./StickyMenuWrapper";

export const Menu = ({ currentPage }: { currentPage: string }) => {
	return (
		<StickyMenuWrapper>
			<HeaderMenu currentPage={currentPage} />
			<FiltersArea />
		</StickyMenuWrapper>
	);
};
