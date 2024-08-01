"use client";
import { useUiStore } from "@/providers/UiStoreProvider";
import { cn } from "@/utility/classNames";
import { type ReactNode, memo } from "react";

export const StickyMenuWrapper = memo(
	({ children }: { children: ReactNode }) => {
		const { isScrolledToTop, isScrollingUp } = useUiStore(
			({ isScrolledToTop, isScrollingUp }) => ({
				isScrolledToTop,
				isScrollingUp,
			}),
		);
		return (
			<header
				className={cn(
					`fixed top-0 z-40 transition-transform left-0 w-screen`,
					`main-header pointer-events-none`,
				)}
				style={{
					transform:
						!isScrolledToTop && !isScrollingUp
							? `translateY(calc(-1 * var(--headerHeight)))`
							: undefined,
				}}
			>
				{children}
			</header>
		);
	},
);
