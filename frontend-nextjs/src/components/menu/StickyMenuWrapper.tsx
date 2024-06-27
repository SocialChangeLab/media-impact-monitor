"use client";
import type { UiState } from "@/stores/uiStore";
import { cn } from "@/utility/classNames";
import { memo, type PropsWithChildren } from "react";

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
				className={cn(
					`fixed top-0 z-50 bg-pattern-soft transition-transform left-0 w-screen`,
				)}
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
