"use client";
import { fadeVariants } from "@/utility/animationUtil";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { useEffect, useRef, type PropsWithChildren } from "react";

function EventsTimelineChartWrapper({
	children,
	animationKey,
	columnsCount = 1,
	className,
}: PropsWithChildren<{
	animationKey: string;
	columnsCount?: number;
	className?: string;
}>) {
	const parentRef = useRef<HTMLDivElement>(null);
	const middleRef = useRef<HTMLSpanElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!parentRef.current || !middleRef.current) return;
		const { clientHeight } = parentRef.current;
		const middleScrollTop = middleRef.current.offsetTop;
		const top = middleScrollTop - (clientHeight - clientHeight / 4);
		parentRef.current.scroll({ top });
	}, [children, animationKey]);

	return (
		<motion.div
			className={cn(
				"w-full bg-grayUltraLight h-[calc(100vh-17rem)] overflow-auto",
				className,
			)}
			ref={parentRef}
		>
			<div className="px-2 min-w-full min-h-full relative flex items-stretch justify-center">
				<motion.ul
					key={animationKey || "events-timeline-chart-wrapper"}
					className={cn(
						"grid grid-flow-col grid-rows-[1fr_0.5px_auto]",
						"items-center justify-stretch gap-y-2 size-full",
						"min-h-[calc(100vh-17rem)]",
					)}
					style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
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
