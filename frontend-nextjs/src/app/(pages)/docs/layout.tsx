"use client";

import DocsOnThisPage from "@/components/DocsOnThisPage";
import { DocsTocLink } from "@/components/DocsTocLink";
import { useUiStore } from "@/providers/UiStoreProvider";
import { cn } from "@/utility/classNames";
import { getDocsToc } from "@/utility/docsUtil";
import { Suspense, type ReactNode } from "react";

function DocsLayout({ children }: { children: ReactNode }) {
	const docsPagesToc = getDocsToc();
	const uiState = useUiStore(
		({ isScrolledToTop, isScrollingUp, scrollThresholdConsideredTheTop }) => ({
			isScrolledToTop,
			isScrollingUp,
			scrollThresholdConsideredTheTop,
		}),
	);
	return (
		<main className={cn("grid grid-cols-[20rem_1fr_20rem]", "min-h-content")}>
			<nav
				aria-label="Table of contents of the documentation"
				className="border-r border-grayLight px-content"
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
			<section className="flex justify-center p-content">
				<Suspense>{children}</Suspense>
			</section>
			<nav
				aria-label="On this page"
				className="border-l border-grayLight px-content"
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
	);
}

export default DocsLayout;
