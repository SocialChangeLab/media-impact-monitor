"use client";
import { cn } from "@/utility/classNames";
import { getDocsFlatToc } from "@/utility/docsUtil";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function DocsPrevNextNav() {
	const pathname = usePathname();
	const currentPage = pathname.split("/").at(-1);

	if (!currentPage) return null;
	const allDocsPages = getDocsFlatToc();
	const currentPageIndex = allDocsPages.findIndex(
		(page) => page.slug === currentPage,
	);
	const prevPageIdx =
		currentPageIndex - 1 >= 0 ? currentPageIndex - 1 : undefined;
	const nextPageIdx =
		currentPageIndex + 1 < allDocsPages.length
			? currentPageIndex + 1
			: undefined;
	const prevPage = typeof prevPageIdx === "number" && allDocsPages[prevPageIdx];
	const nextPage = typeof nextPageIdx === "number" && allDocsPages[nextPageIdx];

	return (
		<div className="flex justify-center py-content border-t border-grayLight opacity-70 hover:opacity-100 transition-opacity">
			<div className="grid grid-cols-2 mx-auto container max-w-prose gap-[calc(var(--pagePadding)*2)]">
				{prevPage ? <DocsPrevNextLink page={prevPage} isPrev /> : <div />}
				{nextPage ? <DocsPrevNextLink page={nextPage} /> : <div />}
			</div>
		</div>
	);
}

function DocsPrevNextLink({
	page,
	isPrev = false,
}: {
	isPrev?: boolean;
	page: {
		slug: string;
		title: string;
		isChartPage: boolean;
	};
}) {
	return (
		<Link
			href={`/docs/${page.slug}`}
			className={cn(
				"grid gap-4 items-center group",
				isPrev && "grid-cols-[auto_1fr]",
				!isPrev && "grid-cols-[1fr_auto]",
			)}
		>
			{isPrev && (
				<ArrowLeft className="text-grayMed group-hover:text-fg transition-colors" />
			)}
			<div className={cn("flex flex-col gap-y-2", isPrev && "text-right")}>
				<span className="text-grayDark group-hover:text-fg transition-colors">
					{isPrev ? "Previous page" : "Next page"}
				</span>
				<span className="font-bold font-headlines text-xl group-hover:underline underline-offset-4">
					{page.title}
				</span>
			</div>
			{!isPrev && (
				<ArrowRight className="text-grayMed group-hover:text-fg transition-colors" />
			)}
		</Link>
	);
}

export default DocsPrevNextNav;
