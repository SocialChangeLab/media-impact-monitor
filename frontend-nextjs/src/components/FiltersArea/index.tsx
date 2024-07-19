"use client";
import { useUiStore } from "@/providers/UiStoreProvider";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, memo, useMemo, useRef } from "react";
import MediaSourceSelect from "../DataSourceSelect";
import DraggableTimeFilterRange from "../DraggableTimeFilterRange";
import { OrganisationsSelect } from "../OrganisationsSelect";
import TimeFilter from "../TimeFilter";
import {
	doesPathnameShowAnyFilter,
	doesPathnameShowMediaFilter,
	doesPathnameShowOrganisationsFilter,
	doesPathnameShowTimeFilter,
} from "../menu/HeaderMenu";

function FiltersArea() {
	const pathname = usePathname();
	const lastPathname = useRef(pathname);
	const isScrolledToTop = useUiStore((state) => state.isScrolledToTop);

	const display = useMemo(() => {
		const any = doesPathnameShowAnyFilter(pathname);
		const media = doesPathnameShowMediaFilter(pathname);
		const organisations = doesPathnameShowOrganisationsFilter(pathname);
		const time = doesPathnameShowTimeFilter(pathname);
		const onlyTime = !media && !organisations && time;
		return { any, media, organisations, time, onlyTime };
	}, [pathname]);

	const lastHasAny = useRef(display.any);

	const previouslyShown = useMemo(() => {
		if (!lastPathname.current) return true;
		const hasAny = doesPathnameShowAnyFilter(lastPathname.current);
		lastPathname.current = pathname;
		return hasAny;
	}, [pathname]);

	const shouldExit = useMemo(() => {
		if (!lastHasAny.current) return display.any;
		const wasShown = lastHasAny.current;
		lastHasAny.current = display.any;
		return wasShown && !display.any;
	}, [display.any]);

	return (
		<motion.nav
			initial={previouslyShown ? "visible" : "hidden"}
			animate={display.any ? "visible" : "hidden"}
			exit="hidden"
			variants={{
				hidden: { transform: "translateY(-100%)", opacity: 0 },
				visible: { transform: "translateY(0%)", opacity: 1 },
			}}
			transition={{
				duration: shouldExit ? 0.3 : 0,
				ease: "circInOut",
			}}
			aria-label="Page filters"
			className={cn(
				`w-screen flex flex-col relative z-40`,
				`px-[clamp(2rem,2vmax,4rem)] mx-auto 2xl:border-x border-grayLight`,
				`border-b bg-pattern-soft max-w-page`,
				isScrolledToTop ? `py-[max(0.25rem,1vmax)]` : `py-2`,
				isScrolledToTop ? `gap-[max(0.25rem,0.75vmax)]` : `gap-2`,
				isScrolledToTop
					? `border-grayLight`
					: `border-grayMed dark:border-grayLight`,
				!isScrolledToTop && `shadow-xl shadow-black/5 dark:shadow-black/30`,
			)}
		>
			<div
				className={cn(
					`flex gap-[max(1rem,2vmax)] justify-between flex-wrap items-center`,
				)}
			>
				{(display.media || display.organisations) && (
					<ul className="flex gap-6 items-center flex-wrap">
						{display.media && (
							<li className="flex flex-col gap-1 text-sm">
								<FilterLabel show={isScrolledToTop}>Media source:</FilterLabel>
								<MediaSourceSelect />
							</li>
						)}
						{display.organisations && (
							<li className="flex flex-col gap-1 text-sm">
								<FilterLabel show={isScrolledToTop}>Organisations:</FilterLabel>
								<OrganisationsSelect />
							</li>
						)}
					</ul>
				)}
				{display.time && (
					<div className="flex flex-col gap-1 text-sm">
						<FilterLabel show={isScrolledToTop}>Time range:</FilterLabel>
						<TimeFilter />
					</div>
				)}
			</div>
			<DraggableTimeFilterRange />
		</motion.nav>
	);
}

const FilterLabel = memo(
	({ children, show }: { children: ReactNode; show: boolean }) => (
		<div className={cn("overflow-clip transition-all", show ? "h-5" : "h-0")}>
			<span className="text-sm">{children}</span>
		</div>
	),
);

export default memo(FiltersArea);
