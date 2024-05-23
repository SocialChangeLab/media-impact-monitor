"use client";
import { cn } from "@/utility/classNames";
import { memo } from "react";

function EventsTimelineChartWrapper({
	children,
	columnsCount = 1,
	className,
}: {
	columnsCount?: number;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn("w-auto min-w-full", className)}
			style={{ width: `max(${columnsCount}rem, 100%)` }}
		>
			<div className="min-w-full min-h-full relative flex items-stretch justify-center">
				<ul
					className={cn(
						"flex min-w-full min-h-full",
						"items-end justify-stretch gap-y-2",
					)}
					style={{ width: `max(${columnsCount}rem, 100%)` }}
				>
					{children}
				</ul>
			</div>
		</div>
	);
}

export default memo(EventsTimelineChartWrapper);
