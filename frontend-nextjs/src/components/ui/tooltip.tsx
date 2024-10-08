"use client";

import { cn } from "@/utility/classNames";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const Portal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={cn(
			"border border-grayMed shadow-lg shadow-black/5 dark:shadow-black/50",
			"z-50 overflow-hidden bg-pattern-soft px-3 py-1.5 text-fg",
			"text-xs animate-in fade-in-0 zoom-in-95",
			"data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
			"data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2",
			"data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
			"data-[side=top]:slide-in-from-bottom-2",
			"max-h-72 overflow-y-auto",
			className,
		)}
		{...props}
	/>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Portal, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
