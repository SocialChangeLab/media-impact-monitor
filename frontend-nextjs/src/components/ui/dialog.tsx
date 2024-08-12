"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/utility/classNames";
import { X } from "lucide-react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-50 bg-bgOverlay cursor-pointer",
			"data-[state=open]:animate-in",
			"data-[state=closed]:animate-out",
			"data-[state=closed]:fade-out-0",
			"data-[state=open]:fade-in-0",
			"[body:has(.boost-header-above-dialog)]:z-30",
			className,
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		childrenContainerClassName?: string;
		animate?: boolean;
	}
>(
	(
		{
			className,
			children,
			childrenContainerClassName,
			animate = true,
			...props
		},
		ref,
	) => (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				ref={ref}
				className={cn(
					"fixed left-1/2 top-1/2 z-50 grid w-full",
					"max-w-lg -translate-x-1/2 -translate-y-1/2",
					"border border-grayLight bg-bg duration-200 focusable",
					animate &&
						cn(
							"data-[state=open]:animate-in",
							"data-[state=closed]:animate-out",
							"data-[state=closed]:fade-out-0",
							"data-[state=open]:fade-in-0",
							"data-[state=closed]:zoom-out-95",
							"data-[state=open]:zoom-in-95",
							"data-[state=closed]:slide-out-to-left-1/2",
							"data-[state=closed]:slide-out-to-top-[48%]",
							"data-[state=open]:slide-in-from-left-1/2",
							"data-[state=open]:slide-in-from-top-[48%]",
						),
					className,
				)}
				{...props}
			>
				<div
					className={cn(
						"relative w-full h-[80vh] overflow-y-auto",
						childrenContainerClassName,
					)}
				>
					{children}

					<DialogPrimitive.Close
						className={cn(
							"absolute right-4 top-4 pointer-events-auto ring-offset-bg",
							"transition focusable bg-bg rounded-full p-1",
							"disabled:pointer-events-none data-[state=open]:bg-fg",
							"data-[state=open]:text-grayDark hover:bg-fg hover:text-bg",
						)}
					>
						<X />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</div>
			</DialogPrimitive.Content>
		</DialogPortal>
	),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-1.5 text-center sm:text-left",
			"border-b border-grayLight p-6 pb-4",
			className,
		)}
		{...props}
	/>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			`px-6 py-4 border-t border-grayLight`,
			className,
		)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			"text-lg font-semibold leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-grayDark", className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
