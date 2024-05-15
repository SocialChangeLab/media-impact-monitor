"use client";
import { fadeVariants } from "@/utility/animationUtil";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";

function EventsTimelineChartWrapper({
	children,
	animationKey,
	columnsCount = 1,
	className,
}: {
	animationKey: string;
	columnsCount?: number;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<motion.div
			className={cn("w-auto min-w-full", className)}
			style={{ width: `max(${columnsCount}rem, 100%)` }}
		>
			<div className="min-w-full min-h-full relative flex items-stretch justify-center">
				<motion.ul
					key={animationKey || "events-timeline-chart-wrapper"}
					className={cn(
						"flex min-w-full pb-4 min-h-full",
						"items-end justify-stretch gap-y-2",
					)}
					style={{ width: `max(${columnsCount}rem, 100%)` }}
					variants={fadeVariants}
					initial="initial"
					animate="enter"
					transition={{ staggerChildren: 0.01 }}
				>
					{children}
				</motion.ul>
			</div>
		</motion.div>
	);
}

export default EventsTimelineChartWrapper;
