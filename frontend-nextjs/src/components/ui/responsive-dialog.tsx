"use client";

import { cn } from "@/utility/classNames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent } from "./dialog";

export function ResponsiveModal({
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

	useEffect(() => {
		setIsOpen(show);
	}, [show]);

	const onClose = useCallback(() => {
		const backLink = searchParams.get("backLink");
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("backLink", encodeURIComponent(`${basePath}${id}`));
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
				className={cn(
					"w-screen h-screen fixed z-50 bg-transparent",
					"overflow-x-hidden overflow-y-auto left-0 top-auto right-0 bottom-0 max-w-screen",
					"block max-w-full translate-x-0 translate-y-0",
					"border-0 pt-56 duration-1000 focusable !pointer-events-none",

					"data-[state=closed]:fade-out-100",
					"data-[state=open]:fade-in-100",
					"data-[state=closed]:zoom-out-100",
					"data-[state=open]:zoom-in-100",
					"data-[state=open]:slide-in-from-bottom",
					"data-[state=closed]:slide-out-to-bottom",
					"data-[state=closed]:slide-out-to-left-1/2",
					"data-[state=open]:slide-in-from-left-1/2",
				)}
				childrenContainerClassName={cn("h-auto min-h-full bg-bg rounded-t-lg")}
				style={{
					transform: `translate(0, ${isOpen ? "0" : "-100%"})`,
				}}
			>
				<div className="w-screen h-auto min-h-full pointer-events-auto">
					{children}
				</div>
			</DialogContent>
		</Dialog>
	);
}
