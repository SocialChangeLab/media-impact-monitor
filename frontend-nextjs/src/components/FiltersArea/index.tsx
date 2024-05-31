import { useUiStore } from "@/providers/UiStoreProvider";
import { cn } from "@/utility/classNames";
import { memo } from "react";
import TimeFilter from "../TimeFilter";

function FiltersArea() {
	const { isScrolledToTop } = useUiStore(
		({ isScrolledToTop, isScrollingUp }) => ({
			isScrolledToTop,
			isScrollingUp,
		}),
	);
	return (
		<nav
			aria-label="Page filters"
			className={cn(
				`w-screen flex gap-[max(1rem,2vmax)] flex-wrap justify-between items-center`,
				`px-[max(1rem,2vmax)]`,
				`border-b border-grayLight z-50 bg-pattern-soft`,
				`transition`,
				isScrolledToTop ? `py-[max(0.25rem,1vmax)]` : `py-2`,
			)}
		>
			<ul className="flex gap-6 items-center flex-wrap"></ul>
			<TimeFilter />
		</nav>
	);
}

export default memo(FiltersArea);
