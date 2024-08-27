"use client";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { CornerLeftDown, CornerLeftUp, HelpCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import InternalLink from "./InternalLink";
import { Button, buttonVariants } from "./ui/button";

type HelpBannerActions = {
	onExpand: () => void;
	onCollapse: () => void;
};

function ExpandedHelpBanner({ onCollapse }: HelpBannerActions) {
	return (
		<div className={cn("flex justify-between items-center relative")}>
			<div className="w-fit flex flex-col ">
				<h1
					className={cn(
						"font-headlines text-2xl lg:text-3xl font-bold",
						"flex items-center mb-1 lg:mb-3 antialiased gap-2",
						"leading-7",
					)}
				>
					The Impact Monitor dashboard
				</h1>
				<p className="text-sm lg:text-base max-w-prose text-pretty mt-1 mb-1 text-fg">
					Welcome to the Impact Monitor dashboard. View protests over time,
					media topics and sentiments, and how organizations impact the media
					landscape.
				</p>
				<p className="text-sm lg:text-base max-w-prose text-pretty mt-2 mb-5 text-fg">
					Start by setting the filters in the top of the page, and scroll down
					to explore the data.
				</p>
				<span className="flex gap-4">
					<Button size="sm" onClick={onCollapse}>
						Got it!
					</Button>{" "}
					<InternalLink
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"border-grayLight",
						)}
						href="/docs"
					>
						Learn more
					</InternalLink>
				</span>
			</div>
			<span
				className={cn(
					"absolute gap-1 top-4 right-0 2xl:right-1/3 pointer-events-none",
					"hidden lg:flex",
				)}
				aria-hidden="true"
			>
				<CornerLeftUp
					className="-rotate-12 text-grayDark opacity-60"
					size={40}
					strokeWidth={1}
				/>
				<div className="flex gap-2 items-center font-semibold mt-4 -translate-x-3">
					<span className="size-6 rounded-full bg-fg text-bg flex items-center justify-center">
						1
					</span>
					<span>Set your filters</span>
				</div>
			</span>
			<span
				className={cn(
					"absolute flex gap-1 bottom-4 right-0 2xl:right-[15%] pointer-events-none",
					"hidden lg:flex",
				)}
				aria-hidden="true"
			>
				<CornerLeftDown
					className="rotate-6 mt-5 text-grayDark opacity-60"
					size={40}
					strokeWidth={1}
				/>
				<div className="flex gap-2 items-center font-semibold -translate-x-3">
					<span className="size-6 rounded-full bg-fg text-bg flex items-center justify-center">
						2
					</span>
					<span>Scroll down and explore</span>
				</div>
			</span>
		</div>
	);
}

function CollapsedHelpBanner({ onExpand }: HelpBannerActions) {
	return (
		<Button size="sm" variant="outline" onClick={onExpand}>
			<HelpCircle size={20} className="text-grayDark" />
			What is this dashboard?
		</Button>
	);
}

function DashboardHelpBannerClient({
	defaultIsExpanded = true,
	persistIsExpanded = () => {},
}: {
	defaultIsExpanded?: boolean | undefined;
	persistIsExpanded?: (value: boolean) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);

	const setIsExpandedValue = useCallback(
		(value: boolean) => {
			setIsExpanded(value);
			persistIsExpanded(value);
		},
		[persistIsExpanded],
	);

	const actions = useMemo(
		() => ({
			onExpand: () => setIsExpandedValue(true),
			onCollapse: () => setIsExpandedValue(false),
		}),
		[setIsExpandedValue],
	);

	return (
		<motion.section
			variants={{
				collapsed: {
					height: `3.6875rem`,
					paddingTop: `0.75rem`,
					paddingBottom: `0.75rem`,
				},
				expanded: {
					height: `20rem`,
					paddingTop: `1rem`,
					paddingBottom: `1rem`,
				},
			}}
			initial={isExpanded ? "expanded" : "collapsed"}
			animate={isExpanded ? "expanded" : "collapsed"}
			className={cn(
				"px-[var(--pagePadding)] overflow-clip flex flex-col justify-center",
				"border-b border-grayLight last-of-type:border-b-0",
			)}
		>
			{isExpanded ? (
				<ExpandedHelpBanner {...actions} />
			) : (
				<CollapsedHelpBanner {...actions} />
			)}
		</motion.section>
	);
}

export default DashboardHelpBannerClient;
