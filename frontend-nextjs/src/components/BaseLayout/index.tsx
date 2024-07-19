"use client";

import Footer from "@/components/Footer";
import { useUiStore } from "@/providers/UiStoreProvider";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Menu } from "../menu";
import { doesPathnameShowAnyFilter } from "../menu/HeaderMenu";

export function BaseLayout({
	children,
	modal,
}: {
	children: ReactNode;
	modal: ReactNode;
}) {
	const pathname = usePathname();
	const currentPage = pathname.split("/")[1] || "home";
	const showFilters = doesPathnameShowAnyFilter(pathname);
	const { scrollThreshold, filtersHeight } = useUiStore((state) => ({
		scrollThreshold: state.scrollThresholdConsideredTheTop,
		filtersHeight: state.filtersAreaHeightDesktop,
	}));
	return (
		<>
			<Menu currentPage={currentPage} />
			<motion.div
				className="layout grid grid-rows-[auto_1fr_auto] w-screen overflow-x-clip max-w-page"
				variants={{
					withoutFilters: { paddingTop: scrollThreshold },
					withFilters: {
						paddingTop: scrollThreshold + filtersHeight,
					},
				}}
				initial={showFilters ? "withFilters" : "withoutFilters"}
				animate={showFilters ? "withFilters" : "withoutFilters"}
				exit="withoutFilters"
				transition={{
					duration: 0.3,
					ease: "circInOut",
				}}
				style={{
					minHeight: `calc(100vh - ${scrollThreshold}px)`,
					paddingTop: scrollThreshold + (showFilters ? filtersHeight : 0),
				}}
			>
				<div className="relative min-h-full">
					<div
						aria-hidden="true"
						className={cn(
							"absolute inset-0 bg-[url(/images/doc-shadow.png)] bg-no-repeat bg-right-top ",
							"dark:mix-blend-normal dark:invert",
							`pointer-events-none`,
							currentPage.startsWith("docs") && "right-80",
						)}
					/>
					<div
						aria-hidden="true"
						className={cn(
							"absolute inset-0 bg-[url(/images/doc-shadow.png)] bg-no-repeat bg-right-top",
							"dark:mix-blend-normal dark:invert",
							"scale-x-[-1]",
							`pointer-events-none`,
							currentPage.startsWith("docs") && "left-80",
						)}
					/>
					{/* <WelcomeMessage currentPage={currentPage} /> */}
					<div className="min-h-full w-screen max-w-page overflow-x-clip relative">
						{children}
					</div>
				</div>
				<Footer />

				{modal}
			</motion.div>
		</>
	);
}
