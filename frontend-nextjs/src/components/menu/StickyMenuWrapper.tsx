"use client";
import { useUiStore } from "@/providers/UiStoreProvider";
import { cn } from "@/utility/classNames";
import { type ReactNode, memo } from "react";

export const StickyMenuWrapper = memo(
	({ children }: { children: ReactNode }) => {
		const { isScrolledToTop, isScrollingUp, scrollThresholdConsideredTheTop } =
			useUiStore(
				({
					isScrolledToTop,
					isScrollingUp,
					scrollThresholdConsideredTheTop,
				}) => ({
					isScrolledToTop,
					isScrollingUp,
					scrollThresholdConsideredTheTop,
				}),
			);
		return (
			<header
				className={cn(`fixed top-0 z-50 transition-transform left-0 w-screen`)}
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
