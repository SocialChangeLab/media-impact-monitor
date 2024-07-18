"use client";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { CornerLeftDown, CornerLeftUp, HelpCircle } from "lucide-react";
import { useMemo, useState } from "react";
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
						"font-headlines text-3xl font-bold",
						"flex items-center mb-1 antialiased gap-2",
					)}
				>
					The Impact Motinor's dashboard
				</h1>
				<p className="max-w-prose mt-2 mb-1 text-fg">
					Welcome to the Impact Motinor's dashboard. Here you can see protests
					over time, media coverage and sentiment in climate-related topics, an
					the impact of protest organisations on the media landscape.
				</p>
				<p className="max-w-prose mt-2 mb-5 text-fg">
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
				className="absolute flex gap-1 top-4 right-1/3 pointer-events-none"
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
				className="absolute flex gap-1 bottom-4 right-[15%] pointer-events-none"
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

function DashboardHelpBanner() {
	const [isExpanded, setIsExpanded] = useState(true);

	const actions = useMemo(
		() => ({
			onExpand: () => setIsExpanded(true),
			onCollapse: () => setIsExpanded(false),
		}),
		[],
	);

	return (
		<motion.section
			variants={{
				collapsed: {
					height: 67,
					paddingTop: 16,
					paddingBottom: 16,
				},
				expanded: {
					height: 280,
					paddingTop: 32,
					paddingBottom: 32,
				},
			}}
			initial="expanded"
			animate={isExpanded ? "expanded" : "collapsed"}
			className={cn(
				"px-[max(1rem,2vmax)] overflow-clip",
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

export default DashboardHelpBanner;
