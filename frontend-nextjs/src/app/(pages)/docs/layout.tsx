"use client";

import DocsOnThisPage from "@/components/DocsOnThisPage";
import DocsPrevNextNav from "@/components/DocsPrevNextNav";
import { DocsTocLink } from "@/components/DocsTocLink";
import NewsletterFooterSection from "@/components/NewsletterFooterSection";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/providers/UiStoreProvider";
import { cn } from "@/utility/classNames";
import { getDocsToc } from "@/utility/docsUtil";
import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import { type ReactNode, Suspense, useEffect, useState } from "react";

function DocsLayout({ children }: { children: ReactNode }) {
	const docsPagesToc = getDocsToc();
	const [showLeftSidebar, setShowLeftSidebar] = useState(false);
	const [showRightSidebar, setShowRightSidebar] = useState(false);

	const uiState = useUiStore((state) => ({
		isScrolledToTop: state.isScrolledToTop,
		isScrollingUp: state.isScrollingUp,
	}));

	useEffect(() => {
		if (showLeftSidebar || showRightSidebar) {
			document.body.classList.add("overflow-clip");
		} else {
			document.body.classList.remove("overflow-clip");
		}
	}, [showLeftSidebar, showRightSidebar]);

	return (
		<>
			<main
				className={cn(
					"grid min-h-content grid-cols-1 xl:grid-cols-[20rem_1fr] 2xl:grid-cols-[20rem_1fr_20rem]",
				)}
			>
				<nav
					aria-label="Table of contents of the documentation"
					className={cn(
						"border-r border-grayLight px-content max-xl:absolute",
						"top-0 bottom-0 left-0 w-80 z-20 bg-bg transition-transform",
						"duration-1000 ease-smooth-out",
						showLeftSidebar
							? "max-xl:translate-x-0"
							: "max-xl:-translate-x-full",
					)}
				>
					<div
						className="sticky transition-all pt-content"
						style={{
							top:
								uiState.isScrolledToTop || uiState.isScrollingUp
									? "var(--headerHeight)"
									: 0,
						}}
					>
						<h2 className="font-headlines text-xl font-bold pb-1 border-b border-grayLight mb-4">
							Documentation
						</h2>
						<ul className="mx-auto max-w-xl flex flex-col gap-2">
							{docsPagesToc.map((docsPage) => (
								<li key={docsPage.slug}>
									{!("children" in docsPage) && <DocsTocLink {...docsPage} />}
									{"children" in docsPage && docsPage.children.length > 0 && (
										<>
											<DocsTocLink {...docsPage} />
											<ul className="mb-4 flex flex-col mt-2">
												{docsPage.children.map((child) => (
													<li key={child.slug}>
														<DocsTocLink {...child} child />
													</li>
												))}
											</ul>
										</>
									)}
								</li>
							))}
						</ul>
					</div>
				</nav>
				<section>
					<div className="flex flex-col items-center max-lg:pt-16 p-content">
						<Suspense>{children}</Suspense>
					</div>
					<DocsPrevNextNav />
				</section>
				<nav
					aria-label="On this page"
					className={cn(
						"border-l border-grayLight px-content max-2xl:absolute",
						"top-0 bottom-0 right-0 w-80 z-20 bg-bg transition-transform",
						"duration-1000 ease-smooth-out",
						showRightSidebar
							? "max-2xl:translate-x-0"
							: "max-2xl:translate-x-full max-2xl:pointer-events-none",
					)}
				>
					<div
						className="sticky transition-all pt-content"
						style={{
							top:
								uiState.isScrolledToTop || uiState.isScrollingUp
									? "var(--headerHeight)"
									: 0,
						}}
					>
						<h4 className="font-headlines text-xl font-bold pb-1 border-b border-grayLight mb-4">
							On this page
						</h4>
						<DocsOnThisPage />
					</div>
				</nav>
			</main>
			<button
				className={cn(
					"fixed inset-0 bg-bgOverlay opacity-0 pointer-events-none transition-opacity z-10",
					(showLeftSidebar || showRightSidebar) &&
						"max-xl:opacity-100 max-xl:pointer-events-auto",
				)}
				type="button"
				onClick={() => {
					setShowLeftSidebar(false);
					setShowRightSidebar(false);
				}}
			/>
			<Button
				size="icon"
				variant="outline"
				className={cn(
					"xl:hidden",
					"bg-bg fixed top-[calc(var(--headerHeight)+1rem)] z-20",
					"shadow-lg shadow-black/5 dark:shadow-black/50",
					"inline-flex items-center transition-all",
					"duration-1000 ease-smooth-out left-[var(--pagePadding)]",
					showLeftSidebar &&
						"translate-x-80 -left-2 xs:left-4 gap-0 shadow-none",
					showRightSidebar && "-translate-x-80",
					!uiState.isScrolledToTop &&
						!uiState.isScrollingUp &&
						"-translate-y-[var(--headerHeight)]",
				)}
				onClick={() => {
					setShowLeftSidebar(!showLeftSidebar);
					setShowRightSidebar(false);
				}}
			>
				{showLeftSidebar ? (
					<SidebarCloseIcon className="size-6" />
				) : (
					<SidebarOpenIcon className="size-6" />
				)}
				<span
					className={cn(
						"pt-0.5 w-16 overflow-clip transition-all",
						"duration-1000 ease-smooth-out",
						showLeftSidebar && "w-0",
					)}
				>
					Pages
				</span>
			</Button>
			<Button
				size="icon"
				variant="outline"
				className={cn(
					"2xl:hidden",
					"bg-bg fixed top-[calc(var(--headerHeight)+1rem)] z-20",
					"shadow-lg shadow-black/5 dark:shadow-black/50",
					"inline-flex items-center transition-all px-3 gap-1 justify-around",
					"duration-1000 ease-smooth-out right-[var(--pagePadding)]",
					showRightSidebar &&
						"-translate-x-80 -right-2 xs:right-4 gap-0 shadow-none",
					showLeftSidebar && "translate-x-80",
					!uiState.isScrolledToTop &&
						!uiState.isScrollingUp &&
						"-translate-y-[var(--headerHeight)]",
				)}
				onClick={() => {
					setShowLeftSidebar(false);
					setShowRightSidebar(!showRightSidebar);
				}}
			>
				<span
					className={cn(
						"pt-0.5 w-24 overflow-clip transition-all",
						"duration-1000 ease-smooth-out",
						showRightSidebar && "w-0",
					)}
				>
					Contents
				</span>
				{showRightSidebar ? (
					<SidebarOpenIcon className="size-6" />
				) : (
					<SidebarCloseIcon className="size-6" />
				)}
			</Button>
			<NewsletterFooterSection />
		</>
	);
}

export default DocsLayout;
