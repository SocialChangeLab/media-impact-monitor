import {
	defineDocumentType,
	makeSource,
	type ComputedFields,
} from "contentlayer/source-files";

const computedFields: ComputedFields = {
	slug: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slugAsParams: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
};

export const DocsPage = defineDocumentType(() => ({
	name: "DocsPage",
	filePathPattern: `docs/**/*.mdx`,
	fields: {
		title: { type: "string", required: true },
		date: { type: "date", required: true },
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "src/content",
	documentTypes: [DocsPage],
});
