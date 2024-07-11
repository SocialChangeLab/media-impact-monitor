import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/utility/classNames";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
} from "lucide-react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
	<nav
		role="navigation"
		aria-label="pagination"
		className={cn(
			"mx-auto flex w-full justify-center gap-4 items-center",
			className,
		)}
		{...props}
	/>
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		className={cn(
			"flex flex-row items-center gap-px bg-grayLight",
			"overflow-clip border border-grayLight",
			className,
		)}
		{...props}
	/>
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
	<li ref={ref} className={cn("bg-bg h-9", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<ButtonProps, "size"> &
	React.ComponentProps<"a">;

const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
	(
		{
			className,
			isActive,
			size = "icon",
			href = "",
			...props
		}: PaginationLinkProps,
		ref,
	) => (
		<Button
			// @ts-ignore
			ref={ref}
			aria-current={isActive ? "page" : undefined}
			variant={isActive ? "default" : "ghost"}
			size={size}
			className={cn(
				"px-1.5 py-2 hover:bg-alt rounded-none",
				`border-none h-9 min-w-9`,
				className,
			)}
			{...props}
		/>
	),
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
	...props
}: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink aria-label="Go to previous page" size="default" {...props}>
		<ChevronLeft />
	</PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationFirst = ({
	...props
}: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink aria-label="Go to first page" size="default" {...props}>
		<ChevronsLeft />
	</PaginationLink>
);
PaginationFirst.displayName = "PaginationFirst";

const PaginationLast = ({
	...props
}: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink aria-label="Go to last page" size="default" {...props}>
		<ChevronsRight />
	</PaginationLink>
);
PaginationLast.displayName = "PaginationLast";

const PaginationNext = ({
	...props
}: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink aria-label="Go to next page" size="default" {...props}>
		<ChevronRight />
	</PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
	className,
	...props
}: React.ComponentProps<"span">) => (
	<span
		aria-hidden
		className={cn(
			"flex items-center justify-center",
			"px-1.5 py-2 h-9 w-9",
			className,
		)}
		{...props}
	>
		<MoreHorizontal size={20} className="text-grayDark opacity-50" />
		<span className="sr-only">More pages</span>
	</span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
