import { cn } from "@/utility/classNames";
import { memo } from "react";
import DraggableTimeFilterRange from "../DraggableTimeFilterRange";
import TimeFilter from "../TimeFilter";

function FiltersArea({ isScrolledToTop }: { isScrolledToTop: boolean }) {
	return (
		<nav
			aria-label="Page filters"
			className={cn(
				`w-screen flex flex-col`,
				`px-[max(1rem,2vmax)]`,
				`border-b border-grayLight z-50 bg-pattern-soft`,
				`transition-all`,
				isScrolledToTop ? `pt-[max(0.25rem,1vmax)]` : `pt-2`,
				isScrolledToTop ? `gap-[max(0.25rem,1vmax)]` : `gap-2`,
			)}
		>
			<div
				className={`flex gap-[max(1rem,2vmax)] flex-wrap justify-between items-center`}
			>
				<ul className="flex gap-6 items-center flex-wrap"></ul>
				<TimeFilter />
			</div>
			<DraggableTimeFilterRange />
		</nav>
	);
}

export default memo(FiltersArea);
