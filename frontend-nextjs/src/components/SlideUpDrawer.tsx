"use client";

import { cn } from "@/utility/classNames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

export function SlideUpDrawer({
	children,
	id,
	basePath,
}: {
	children: ReactNode;
	id?: string;
	basePath: string;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const show = !!id && pathname.startsWith(basePath);
	const [isOpen, setIsOpen] = useState(show);

	const searchParams = useSearchParams();

	useEffect(() => setIsOpen(show), [show]);

	const onClose = useCallback(() => {
		const backLink = searchParams.get("backLink");
		const newSearchParams = new URLSearchParams(
			Object.fromEntries(searchParams),
		);
		newSearchParams.set("backLink", `${basePath}${id}`);
		if (typeof backLink === "string" && backLink.startsWith("/")) {
			router.push(`${backLink}?${newSearchParams.toString()}`);
		} else {
			const validatedBasePath =
				basePath === "/events/" ? "/" : basePath.replace(/\/$/, "");
			router.push(`${validatedBasePath}?${newSearchParams.toString()}`);
		}
	}, [router, searchParams, id, basePath]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
				setIsOpen(open);
			}}
		>
			<DialogContent
				animate={false}
				className={cn(
					"w-screen h-screen fixed z-50 bg-transparent max-w-screen-maxPage",
					"overflow-x-hidden overflow-y-auto left-1/2 -translate-x-1/2",
					"top-auto right-auto bottom-0 max-w-screen",
					"block max-w-full translate-y-0",
					"border-0 pt-56 focusable !pointer-events-none",

					"data-[state=open]:animate-in",
					"data-[state=closed]:animate-out",
					"data-[state=open]:slide-in-from-left-1/2",
					"data-[state=closed]:slide-in-to-left-1/2",
					"data-[state=open]:slide-in-from-bottom",
					"data-[state=closed]:slide-out-to-bottom",
				)}
				childrenContainerClassName={cn(
					"h-auto min-h-full bg-pattern-soft rounded-t-lg",
				)}
				style={{
					animationDuration: "1000ms",
					animationTimingFunction: "cubic-bezier(0,1.01,0,1)",
				}}
			>
				<div className="w-screen h-auto min-h-full pointer-events-auto">
					{children}
				</div>
			</DialogContent>
		</Dialog>
	);
}
