import DocsContentSection from "@/components/DocsContentSection";
import { Mdx } from "@/components/Mdx";
import { getAllDocsPages, getDocsPage } from "@/utility/docsUtil";
import { notFound } from "next/navigation";
import slugify from "slugify";

export const generateStaticParams = () => {
	const allDocsPages = getAllDocsPages();
	return allDocsPages.map(({ slug }) => ({ slug }));
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const docsPage = getDocsPage(params.slug);
	if (!docsPage) throw new Error(`DocsPage not found for slug: ${params.slug}`);
	return { title: docsPage.title };
};

const DocsPageLayout = ({ params }: { params: { slug: string } }) => {
	const docsPage = getDocsPage(params.slug);
	if (!docsPage) notFound();

	return (
		<article className="mx-auto container max-w-prose py-8" id="docs-content">
			<div className="mb-8">
				<h1
					className="mt-2 scroll-m-20 text-5xl font-bold tracking-tight font-headlines"
					id={slugify(docsPage.title, { lower: true, strict: true })}
				>
					{docsPage.title}
				</h1>
			</div>
			{docsPage.isTopLevel && docsPage.body?.code && (
				<Mdx code={docsPage.body.code} />
			)}
			{!docsPage.isTopLevel && (
				<>
					{docsPage.intro && <DocsContentSection {...docsPage.intro} noTitle />}
					{docsPage.info && <DocsContentSection {...docsPage.info} />}
					{docsPage.methodology && (
						<DocsContentSection {...docsPage.methodology} />
					)}
					{docsPage.data && <DocsContentSection {...docsPage.data} />}
				</>
			)}
		</article>
	);
};

export default DocsPageLayout;
