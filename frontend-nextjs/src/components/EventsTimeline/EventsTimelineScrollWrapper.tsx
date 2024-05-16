"use client";
import { cn } from "@/utility/classNames";
import { useEffect, useRef } from "react";

function EventsTimelineScrollWrapper({
	children,
	animationKey,
}: { children: React.ReactNode; animationKey: string }) {
	const parentRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!parentRef.current) return;
		const { clientHeight } = parentRef.current;
		const top = parentRef.current.scrollHeight - clientHeight;
		parentRef.current.scroll({ top });
	}, [children, animationKey]);

	return (
		<div className="w-[calc(100vw-3rem)] overflow-clip relative">
			<div
				className={cn(
					"w-[calc(100vw-3rem)] overflow-auto grid grid-cols-1 grid-rows-[1fr_3.5rem] relative",
					"h-[calc(100vh-14rem)] bg-grayUltraLight",
				)}
				ref={parentRef}
			>
				{children}
			</div>
			<div
				className={cn(
					"absolute w-[calc(100vw-3rem)]",
					"left-0 top-0 bottom-14",
					"border border-grayLight border-b-0",
					"pointer-events-none",
				)}
				aria-hidden="true"
			></div>
		</div>
	);
}

export default EventsTimelineScrollWrapper;
