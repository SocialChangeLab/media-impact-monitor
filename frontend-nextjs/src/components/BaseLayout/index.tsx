"use client";

import Footer from "@/components/Footer";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Menu } from "../menu";

export function BaseLayout({
	children,
	modal,
}: {
	children: ReactNode;
	modal: ReactNode;
}) {
	const pathname = usePathname();
	const currentPage = pathname.split("/")[1] || "events";
	return (
		<div
			className="layout grid grid-rows-[auto_1fr_auto] w-screen overflow-x-clip transition-all"
			style={{
				paddingTop: 75 + (pathname === "/" ? 125 : 0),
				minHeight: `calc(100vh - ${75 + (pathname === "/" ? 77 : 0)}px)`,
			}}
		>
			<Menu currentPage={currentPage} />
			<div className="relative min-h-full">
				<div
					aria-hidden="true"
					className={cn(
						"absolute inset-0 bg-[url(/images/doc-shadow.png)] bg-no-repeat bg-right-top ",
						"dark:mix-blend-normal dark:invert",
						`pointer-events-none`,
					)}
				/>
				<div
					aria-hidden="true"
					className={cn(
						"absolute inset-0 bg-[url(/images/doc-shadow.png)] bg-no-repeat bg-right-top",
						"dark:mix-blend-normal dark:invert",
						"scale-x-[-1]",
						`pointer-events-none`,
					)}
				/>
				{/* <WelcomeMessage currentPage={currentPage} /> */}
				<div className="min-h-full w-screen overflow-x-clip relative">
					{children}
				</div>
			</div>
			<Footer />
			{modal}
		</div>
	);
}
