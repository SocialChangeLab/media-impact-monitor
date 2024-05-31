"use client";
import type { UiState } from "@/stores/uiStore";
import { type PropsWithChildren, memo } from "react";

type StickyMenuWrapperProps = PropsWithChildren<
	Pick<
		UiState,
		"isScrolledToTop" | "isScrollingUp" | "scrollThresholdConsideredTheTop"
	>
>;

export const StickyMenuWrapper = memo(
	({
		children,
		isScrolledToTop,
		isScrollingUp,
		scrollThresholdConsideredTheTop,
	}: StickyMenuWrapperProps) => {
		return (
			<header
				className={`fixed top-0 z-50 bg-pattern-soft transition-transform`}
				style={{
					transform:
						!isScrolledToTop && !isScrollingUp
							? `translateY(-${scrollThresholdConsideredTheTop}px)`
							: undefined,
				}}
			>
				{children}
			</header>
		);
	},
);
