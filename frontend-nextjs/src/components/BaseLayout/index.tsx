"use client";

import Footer from "@/components/Footer";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo, useRef } from "react";
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
	const previouslyShown = useRef(showFilters);

	const shouldExit = useMemo(() => {
		if (!previouslyShown.current) return showFilters;
		const wasShown = previouslyShown.current;
		previouslyShown.current = showFilters;
		return wasShown && !showFilters;
	}, [showFilters]);

	return (
		<>
			<Menu currentPage={currentPage} />
			<motion.div
				className={cn(
					"layout grid grid-rows-[auto_1fr_auto] w-screen overflow-x-clip max-w-page",
					"maxPage:border-x maxPage:border-grayLight min-h-screen grid-rows-[1fr_auto]",
					"transition-all duration-1000 ease-smooth-out",
				)}
				style={{
					paddingTop: showFilters
						? `calc(var(--headerHeight) + var(--filtersHeight))`
						: `var(--headerHeight)`,
				}}
				variants={{
					withoutFilters: { paddingTop: `var(--headerHeight)` },
					withFilters: {
						paddingTop: `calc(var(--headerHeight) + var(--filtersHeight)`,
					},
				}}
				initial={showFilters ? "withFilters" : "withoutFilters"}
				animate={showFilters ? "withFilters" : "withoutFilters"}
				exit="withoutFilters"
				transition={{
					duration: shouldExit ? 0.3 : 0,
					ease: "circInOut",
				}}
			>
				<div className="relative min-h-full">
					<div
						aria-hidden="true"
						className={cn(
							"absolute inset-0 bg-[url(/images/doc-shadow.webp)] bg-no-repeat bg-right-top ",
							"dark:mix-blend-normal dark:invert",
							`pointer-events-none`,
							currentPage.startsWith("docs") && "2xl:right-80",
						)}
					/>
					<div
						aria-hidden="true"
						className={cn(
							"absolute inset-0 bg-[url(/images/doc-shadow.webp)] bg-no-repeat bg-right-top",
							"dark:mix-blend-normal dark:invert",
							"scale-x-[-1]",
							`pointer-events-none`,
							currentPage.startsWith("docs") && "xl:left-80",
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
