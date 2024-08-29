"use client";

import { cn } from "@/utility/classNames";
import { randomInRange } from "@/utility/randomUtil";
import { texts } from "@/utility/textUtil";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";

type HeadingElement = {
	id: string;
	text: string;
	level: number;
	node: HTMLHeadElement;
	visible: boolean;
};

const skeletons = Array.from({ length: 5 }).map((_, idx) => ({
	id: `skeleton-${idx}`,
	text: `Skeleton ${idx}`,
	level: 2,
	node: null,
	visible: false,
}));

const PlaceholderSkeleton = memo(
	({ width, height }: { width: number | string; height?: number | string }) => (
		<span
			className="h-4 w-32 bg-grayMed rounded animate-pulse inline-block"
			style={{ width, height }}
		/>
	),
);

function DocsOnThisPage() {
	const pathname = usePathname();
	const [headingElements, setHeadingElements] = useState<HeadingElement[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const container = document.getElementById("docs-content");
		if (!container) return;
		const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4"))
			.filter((node) => node.id)
			.sort((a, b) => {
				const aPosInPage = a.getBoundingClientRect().top;
				const bPosInPage = b.getBoundingClientRect().top;
				return aPosInPage - bPosInPage;
			}) as HTMLHeadingElement[];

		if (headings.length === 0) return;

		const hierarchy = headings.reduce((acc, heading) => {
			if (!heading.textContent) return acc;
			const level = Number.parseInt(
				heading.tagName.toLowerCase().replace("h", ""),
			);
			acc.push({
				id: heading.id,
				text: heading.textContent,
				node: heading,
				level,
				visible: false,
			});
			return acc;
		}, [] as HeadingElement[]);

		setHeadingElements(hierarchy);
	}, [pathname]);

	useEffect(() => {
		if (!isLoading) return;
		setIsLoading(false);
		if (headingElements.length === 0) return;
		const observer = new IntersectionObserver(onObserve);
		function onObserve(entries: IntersectionObserverEntry[]) {
			const intersectingEntries = entries.filter((e) => e.isIntersecting);
			if (intersectingEntries.length === 0) return;
			const newHeadings = headingElements.map((headingElement) => ({
				...headingElement,
				visible: !!intersectingEntries.find(
					(e) => e.target.id === headingElement.id,
				),
			}));
			setHeadingElements(newHeadings);
		}
		for (const heading of headingElements) {
			observer.observe(heading.node);
		}
		return () => {
			for (const heading of headingElements) {
				observer.unobserve(heading.node);
			}
		};
	}, [headingElements, isLoading]);

	return (
		<ul className="flex flex-col text-sm pb-8">
			{isLoading && (
				<ul aria-hidden="true" className="flex flex-col gap-3 text-sm">
					{skeletons.map((skeleton) => (
						<PlaceholderSkeleton
							key={skeleton.id}
							width={`${randomInRange(40, 60, skeleton.id)}%`}
							height="0.75rem"
						/>
					))}
				</ul>
			)}
			{!isLoading && headingElements.length === 0 && (
				<p className="text-grayDark">{texts.docsPage.tocNoContentsFound}</p>
			)}
			{headingElements.map((heading) => (
				<li key={heading.id}>
					<a
						href={`#${heading.id}`}
						className={cn(
							`text-grayDark hover:text-fg transition-all py-1 block`,
							heading.visible && `font-bold text-fg`,
							heading.level >= 3 && `border-l border-grayLight `,
							heading.level >= 3 &&
								heading.visible &&
								`border-fg border-l-2 font-bold text-fg`,
						)}
					>
						{heading.level === 3 && (
							<span className="pl-4">{heading.text}</span>
						)}
						{heading.level === 4 && (
							<span className="pl-8">{heading.text}</span>
						)}
						{heading.level === 2 && heading.text}
					</a>
				</li>
			))}
		</ul>
	);
}

export default memo(DocsOnThisPage);
