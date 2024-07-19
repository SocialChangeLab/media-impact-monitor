"use client";
import { cn } from "@/utility/classNames";
import Link, { type LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type AnchorHTMLAttributes, forwardRef } from "react";

export type InternalLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof LinkProps
> &
	LinkProps;

const InternalLink = forwardRef<HTMLAnchorElement, InternalLinkProps>(
	({ href, className, ...props }, ref) => {
		const pathname = usePathname();
		const searchParams = useSearchParams();
		const newSearchParams = new URLSearchParams(
			Object.fromEntries(searchParams),
		);
		newSearchParams.set("backLink", pathname);
		return (
			<Link
				{...props}
				href={`${href}?${newSearchParams.toString()}`}
				className={cn("focusable", className)}
				ref={ref}
			/>
		);
	},
);

export default InternalLink;
