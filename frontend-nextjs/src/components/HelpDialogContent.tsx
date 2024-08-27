"use client";
import { cn } from "@/utility/classNames";
import { getDocsPage } from "@/utility/docsUtil";
import { ArrowRight } from "lucide-react";
import DocsChartContentSection from "./DocsContentSection";
import InternalLink from "./InternalLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

function HelpDialogContent({ slug }: { slug: string }) {
	const docsPage = getDocsPage(slug);
	if (!docsPage || docsPage.isTopLevel) return null;
	const hasAnySubpage = docsPage.info || docsPage.methodology || docsPage.data;
	if (!hasAnySubpage) return null;
	return (
		<Tabs>
			<div className="w-full bg-grayUltraLight pt-8 border-b border-grayLight sticky top-0 z-10">
				<div className="mt-2 scroll-m-20  px-content w-full flex justify-center">
					<div className="w-full font-base max-w-prose block">
						<h2 className="text-5xl font-bold tracking-tight font-headlines mb-2">
							{docsPage.title}
						</h2>
						<InternalLink
							href={`/docs/${docsPage.slug}`}
							className={cn(
								"text-grayDark flex gap-2 items-center",
								"hover:text-fg hover:underline underline-offset-4 transition-colors",
							)}
						>
							Read in the docs <ArrowRight size={16} />
						</InternalLink>
					</div>
				</div>
				<div className="w-full flex pt-6 overflow-x-auto -ml-4 translate-y-px px-content">
					<div className="w-full max-w-prose mx-auto">
						<TabsList>
							{docsPage.info && <TabsTrigger value="info">Info</TabsTrigger>}
							{docsPage.methodology && (
								<TabsTrigger value="methodology">Methodology</TabsTrigger>
							)}
							{docsPage.data && <TabsTrigger value="data">Data</TabsTrigger>}
						</TabsList>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center w-full max-w-screen-lg px-content pt-8 pb-16 px-content">
				{docsPage.info && (
					<TabsContent value="info">
						<DocsChartContentSection {...docsPage.info} />
					</TabsContent>
				)}
				{docsPage.methodology && (
					<TabsContent value="methodology">
						<DocsChartContentSection {...docsPage.methodology} />
					</TabsContent>
				)}
				{docsPage.data && (
					<TabsContent value="data">
						<DocsChartContentSection {...docsPage.data} />
					</TabsContent>
				)}
			</div>
		</Tabs>
	);
}

export default HelpDialogContent;
