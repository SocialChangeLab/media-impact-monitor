import { Mdx } from "@/components/Mdx";
import { getDocsPage } from "@/utility/docsUtil";
import { type DocsPage, allDocsPages } from "contentlayer/generated";
import { notFound } from "next/navigation";

export const generateStaticParams = async () =>
	allDocsPages.map(({ slug }) => ({ slug }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
	const docsPage = getDocsPage(params.slug);
	if (!docsPage) throw new Error(`DocsPage not found for slug: ${params.slug}`);
	return { title: docsPage.title };
};

function ChartContentSection(doc: DocsPage) {
	const id = `chart-title-${doc.slug}`;
	return (
		<>
			<h2
				className="mt-2 scroll-m-20 text-4xl font-semibold tracking-tight mb-4 font-headlines"
				id={id}
			>
				<a href={`#${id}`}>{doc.title}</a>
			</h2>
			<Mdx code={doc.body.code} />
			<hr className="my-4 md:my-8 border-grayLight text-grayLight" />
			<br />
		</>
	);
}

const DocsPageLayout = ({ params }: { params: { slug: string } }) => {
	const docsPage = getDocsPage(params.slug);
	if (!docsPage) notFound();

	return (
		<article className="mx-auto container max-w-prose py-8" id="docs-content">
			<div className="mb-8">
				<h1 className="mt-2 scroll-m-20 text-5xl font-bold tracking-tight font-headlines">
					{docsPage.title}
				</h1>
			</div>
			{!docsPage.isChartPage && <Mdx code={docsPage.body.code} />}
			{docsPage.isChartPage && (
				<>
					{docsPage.intro && <ChartContentSection {...docsPage.intro} />}
					<ChartContentSection {...docsPage.info} />
					<ChartContentSection {...docsPage.methodology} />
					<ChartContentSection {...docsPage.data} />
				</>
			)}
		</article>
	);
};

export default DocsPageLayout;
