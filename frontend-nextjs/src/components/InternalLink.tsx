"use client";
import Link, { type LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";

export type InternalLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof LinkProps
> &
	LinkProps;

function InternalLink({ href, ...props }: InternalLinkProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const newSearchParams = new URLSearchParams(searchParams);
	newSearchParams.set("backLink", pathname);
	return <Link href={`${href}?${newSearchParams.toString()}`} {...props} />;
}

export default InternalLink;
