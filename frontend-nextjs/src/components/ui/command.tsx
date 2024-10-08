"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/utility/classNames";
import { SearchIcon } from "lucide-react";

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			"flex h-full w-full flex-col overflow-hidden bg-bg text-fg",
			"border-grayMed",
			className,
		)}
		{...props}
	/>
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent className="overflow-hidden p-0">
				<Command
					className={cn(
						"[&_[cmdk-group-heading]]:px-2",
						"[&_[cmdk-group-heading]]:font-medium",
						"[&_[cmdk-group-heading]]:text-grayDark",
						"[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
						"[&_[cmdk-group]]:px-2",
						"[&_[cmdk-input-wrapper]_svg]:h-5",
						"[&_[cmdk-input-wrapper]_svg]:w-5",
						"[&_[cmdk-input]]:h-12",
						"[&_[cmdk-item]]:px-2",
						"[&_[cmdk-item]]:py-3",
						"[&_[cmdk-item]_svg]:h-5",
						"[&_[cmdk-item]_svg]:w-5",
					)}
				>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div
		className="flex items-center border-b border-grayLight p-0 pl-3"
		cmdk-input-wrapper=""
	>
		<SearchIcon className="shrink-0 opacity-50" />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				"flex h-10 w-full bg-transparent py-3 text-sm outline-none border-none pr-0",
				"placeholder:text-grayDark disabled:cursor-not-allowed disabled:opacity-50",
				`focus-visible:ring-inset`,
				className,
			)}
			{...props}
		/>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
		{...props}
	/>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
	<CommandPrimitive.Empty
		ref={ref}
		className="py-6 text-center text-sm"
		{...props}
	/>
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			"overflow-hidden text-foreground",
			"[&_[cmdk-group-heading]]:px-4",
			"[&_[cmdk-group-heading]]:py-1.5",
			"[&_[cmdk-group-heading]]:text-sm",
			"[&_[cmdk-group-heading]]:font-medium",
			"[&_[cmdk-group-heading]]:text-grayDark",
			className,
		)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 h-px bg-grayLight", className)}
		{...props}
	/>
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none",
			"items-center px-4 py-2 gap-2",
			"outline-none aria-selected:bg-grayLight",
			"aria-selected:text-fg aria-selected:cursor-pointer",
			"data-[disabled]:pointer-events-none",
			"data-[disabled]:opacity-50",
			"transition-colors border-b border-grayUltraLight",
			"last-of-type:border-b-0",
			className,
		)}
		{...props}
	/>
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn("ml-auto text-xs tracking-widest text-grayDark", className)}
			{...props}
		/>
	);
};
CommandShortcut.displayName = "CommandShortcut";

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};
