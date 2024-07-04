// import rehypeToc from "@jsdevtools/rehype-toc";
import {
	defineDocumentType,
	makeSource,
	type ComputedFields,
} from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import slugify from "slugify";

const computedFields: ComputedFields = {
	slug: {
		type: "string",
		resolve: (doc) => slugify(doc.title, { lower: true, strict: true }),
	},
};

export const DocsPage = defineDocumentType(() => ({
	name: "DocsPage",
	filePathPattern: `docs/**/*.mdx`,
	contentType: "mdx",
	fields: {
		tocOrder: { type: "number", required: false, default: 999 },
		title: { type: "string", required: true },
		date: { type: "date", required: true },
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "src/content",
	documentTypes: [DocsPage],
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["subheading-anchor"],
						ariaLabel: "Link to section",
					},
				},
			],
			// rehypeToc,
		],
	},
});
