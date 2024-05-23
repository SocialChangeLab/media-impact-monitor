"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/utility/classNames";
import { useAnimationFrame } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Mouse } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

function EventsTimelineScrollWrapper({
	children,
}: { children: React.ReactNode }) {
	const parentRef = useRef<HTMLDivElement>(null);
	const [showUpArrow, setShowUpArrow] = useState(false);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(false);
	const [showDownArrow, setShowDownArrow] = useState(false);

	useAnimationFrame(() => {
		if (!parentRef.current) return;
		const {
			scrollTop,
			scrollLeft,
			scrollWidth,
			scrollHeight,
			clientWidth,
			clientHeight,
		} = parentRef.current;
		setShowUpArrow(scrollTop > 10);
		setShowDownArrow(scrollTop < scrollHeight - clientHeight - 10);
		setShowLeftArrow(scrollLeft > 10);
		setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!parentRef.current) return;
		const { clientHeight } = parentRef.current;
		const top = parentRef.current.scrollHeight - clientHeight;
		parentRef.current.scroll({ top });
	}, [children]);

	const scrollUp = useCallback(() => {
		if (!parentRef.current) return;
		parentRef.current.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const scrollLeft = useCallback(() => {
		if (!parentRef.current) return;
		parentRef.current.scrollTo({ left: 0, behavior: "smooth" });
	}, []);

	const scrollRight = useCallback(() => {
		if (!parentRef.current) return;
		const { scrollWidth, clientWidth } = parentRef.current;
		parentRef.current.scrollTo({
			left: scrollWidth - clientWidth,
			behavior: "smooth",
		});
	}, []);

	const scrollDown = useCallback(() => {
		if (!parentRef.current) return;
		const { scrollHeight, clientHeight } = parentRef.current;
		parentRef.current.scrollTo({
			top: scrollHeight - clientHeight,
			behavior: "smooth",
		});
	}, []);

	const arrowButtons = [
		{
			direction: "up",
			Icon: ArrowUp,
			onClick: scrollUp,
			visible: showUpArrow,
			className: cn("top-4 left-1/2 -translate-x-1/2", "flex-col"),
		},
		{
			direction: "left",
			Icon: ArrowLeft,
			onClick: scrollLeft,
			visible: showLeftArrow,
			className: cn("top-1/2 -translate-y-1/2 left-4", "px-1 py-0"),
		},
		{
			direction: "right",
			Icon: ArrowRight,
			onClick: scrollRight,
			visible: showRightArrow,
			className: cn(
				"top-1/2 -translate-y-1/2 right-4",
				"flex-row-reverse px-1 py-0",
			),
		},
		{
			direction: "down",
			Icon: ArrowDown,
			onClick: scrollDown,
			visible: showDownArrow,
			className: cn("bottom-20 left-1/2 -translate-x-1/2", "flex-col-reverse"),
		},
	];

	return (
		<div className="w-[calc(100vw-3rem)] overflow-clip relative group">
			{arrowButtons.map(({ direction, Icon, onClick, visible, className }) => (
				<Button
					key={direction}
					type="button"
					variant="ghost"
					onClick={onClick}
					aria-label={`Scroll ${direction}`}
					className={cn(
						"absolute z-20 bg-grayUltraLight opacity-0 transition",
						"text-grayDark hover:bg-none focus-visible:bg-bg",
						"inline-flex size-auto gap-0.5 py-1 px-0 rounded-full",
						className,
						visible
							? "group-hover:opacity-70 hover:opacity-100"
							: "opacity-0 pointer-events-none",
					)}
					tabIndex={visible ? 0 : -1}
				>
					<Icon size={16} />
					<Mouse />
				</Button>
			))}
			<div
				aria-hidden="true"
				className={cn(
					"w-[calc(100vw-3rem)] overflow-auto grid grid-cols-1 grid-rows-[1fr_3.5rem] relative",
					"h-[var(--protest-timeline-height)] bg-grayUltraLight",
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
			></div>
		</div>
	);
}

export default memo(EventsTimelineScrollWrapper);
