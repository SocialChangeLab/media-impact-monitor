"use client";
import { DocsTocLink } from "@/components/DocsTocLink";
import { cn } from "@/utility/classNames";
import { getDocsToc } from "@/utility/docsUtil";
import { Suspense, type ReactNode } from "react";

export function DocsLayout({ children }: { children: ReactNode }) {
	const docsPagesToc = getDocsToc();
	return (
		<main className={cn("grid grid-cols-[20rem_1fr_20rem]", "min-h-content")}>
			<nav
				aria-label="Table of contents of the documentation"
				className="border-r border-grayLight p-content"
			>
				<h2 className="font-headlines text-2xl font-bold pb-1 border-b border-grayLight mb-4">
					Table of contents
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
			</nav>
			<section className="flex justify-center p-content">
				<Suspense>{children}</Suspense>
			</section>
			<nav
				aria-label="On this page"
				className="border-l border-grayLight p-content"
			>
				<h2 className="font-headlines text-2xl font-bold pb-1 border-b border-grayLight mb-4">
					On this page
				</h2>
				<DocsOnThisPage />
			</nav>
		</main>
	);
}
