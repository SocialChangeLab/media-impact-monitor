import type { DocsPage } from "contentlayer/generated";
import { Mdx } from "./Mdx";

function DocsChartContentSection({
	noTitle = false,
	...doc
}: DocsPage & { noTitle?: boolean }) {
	const id = `chart-title-${doc.slug}`;
	return (
		<>
			{!noTitle && (
				<h2
					className="mt-2 scroll-m-20 text-4xl font-semibold tracking-tight mb-6 font-headlines"
					id={id}
				>
					<a href={`#${id}`} className="focusable">
						{doc.title}
					</a>
				</h2>
			)}
			<Mdx code={doc.body.code} />
			<hr className="my-4 md:my-8 border-grayLight text-grayLight" />
			<br />
		</>
	);
}

export default DocsChartContentSection;
