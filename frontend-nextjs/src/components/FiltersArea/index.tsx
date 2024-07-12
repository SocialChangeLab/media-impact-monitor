"use client";
import { cn } from "@/utility/classNames";
import { type ReactNode, memo } from "react";
import MediaSourceSelect from "../DataSourceSelect";
import DraggableTimeFilterRange from "../DraggableTimeFilterRange";
import { OrganisationsSelect } from "../OrganisationsSelect";
import TimeFilter from "../TimeFilter";

function FiltersArea({ isScrolledToTop }: { isScrolledToTop: boolean }) {
	return (
		<nav
			aria-label="Page filters"
			className={cn(
				`w-screen flex flex-col`,
				`px-[clamp(2rem,2vmax,4rem)] mx-auto 2xl:border-x border-grayLight`,
				`border-b z-50 bg-pattern-soft max-w-page 2xl:border-x border-grayLight`,
				`transition-all`,
				isScrolledToTop ? `py-[max(0.25rem,1vmax)]` : `py-2`,
				isScrolledToTop ? `gap-[max(0.25rem,0.75vmax)]` : `gap-2`,
				isScrolledToTop
					? `border-grayLight`
					: `border-grayMed dark:border-grayLight`,
				!isScrolledToTop && `shadow-xl shadow-black/5 dark:shadow-black/30`,
			)}
		>
			<div
				className={`flex gap-[max(1rem,2vmax)] flex-wrap justify-between items-center`}
			>
				<ul className="flex gap-6 items-center flex-wrap">
					<li className="flex flex-col gap-1 text-sm">
						<FilterLabel show={isScrolledToTop}>Media source:</FilterLabel>
						<MediaSourceSelect />
					</li>
					<li className="flex flex-col gap-1 text-sm">
						<FilterLabel show={isScrolledToTop}>Organisations:</FilterLabel>
						<OrganisationsSelect />
					</li>
				</ul>
				<div className="flex flex-col gap-1 text-sm">
					<FilterLabel show={isScrolledToTop}>Time range:</FilterLabel>
					<TimeFilter />
				</div>
			</div>
			<DraggableTimeFilterRange />
		</nav>
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
