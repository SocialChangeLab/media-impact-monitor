import { type DocsPage, allDocsPages } from "contentlayer/generated";
import slugify from "slugify";

type DocsPageBase = DocsPage & {
	slug: string;
	title: string;
	tocOrder?: number;
};

type TopLevelDocsPage = DocsPageBase & {
	isTopLevel: true;
	children: [];
};

type SecondLevelDocsPage = DocsPageBase & {
	children: ThirdLevelDocsPage[];
	isTopLevel: true;
};

type ThirdLevelDocsPage = DocsPageBase & {
	isTopLevel: false;
	intro?: DocsPageBase;
	info?: DocsPageBase;
	methodology?: DocsPageBase;
	data?: DocsPageBase;
};

type ParsedDocsPage = TopLevelDocsPage | SecondLevelDocsPage;

export function getAllDocsPages() {
	const pagesMap = allDocsPages.reduce((acc, doc) => {
		const path = doc._raw.flattenedPath
			.split("/")
			.slice(1)
			.map(slugifyPageName);
		const [parentPageName, pageName] = path;
		if (path.length === 0) return acc;
		if (path.length === 1) {
			acc.set(parentPageName, {
				...doc,
				title: doc.title || camelToCapitalCase(parentPageName ?? ""),
				slug: parentPageName,
				isTopLevel: true,
				children: [],
			} satisfies TopLevelDocsPage);
			return acc;
		}
		if (path.length !== 3) return acc;
		const parsedParentPageName = slugifyPageName(parentPageName);
		const parsedPageName = slugifyPageName(pageName);
		const existingParent = acc.get(parsedParentPageName) as
			| SecondLevelDocsPage
			| undefined;
		const getByKey = (slug: string) =>
			allDocsPages.find((d) => {
				const path = d._raw.flattenedPath.split("/").slice(1);
				const s = slugifyPageName(path.at(-1) ?? "");
				const p = slugifyPageName(path.at(-2) ?? "");
				return s === slug && p === parsedPageName;
			});
		const intro = getByKey("intro");
		const methodology = getByKey("methodology");
		const info = getByKey("info");
		const data = getByKey("data");
		const previousChildren = existingParent?.children ?? [];
		const existingChild = previousChildren.find(
			(child) => child.slug === parsedPageName,
		);
		if (existingChild) return acc;
		acc.set(parsedParentPageName, {
			...doc,
			...existingParent,
			title: camelToCapitalCase(parsedParentPageName),
			slug: parsedParentPageName,
			isTopLevel: true,
			children: [
				...(existingParent?.children ?? []),
				{
					...doc,
					title: camelToCapitalCase(parsedPageName),
					slug: parsedPageName,
					isTopLevel: false,
					intro,
					methodology,
					data,
					info,
				},
			],
		} satisfies SecondLevelDocsPage);
		return acc;
	}, new Map<string, ParsedDocsPage>());
	return Array.from(pagesMap.values());
}

export function getDocsPage(slug: string) {
	const parsedSlug = slugifyPageName(slug);
	const docsPage = getDocsFlatToc().find(
		(docsPage) => slugifyPageName(docsPage.slug) === parsedSlug,
	);
	return docsPage || null;
}

export function getDocsToc() {
	const docsPages = getAllDocsPages();
	return docsPages.sort(sortPages).map((docsPage) => ({
		...docsPage,
		slug: docsPage.children?.length ? docsPage.children[0].slug : docsPage.slug,
		children: docsPage.children?.sort(sortPages),
	}));
}

export function getDocsFlatToc() {
	return getAllDocsPages().flatMap((docsPage) =>
		docsPage.children ? [docsPage, ...docsPage.children] : [docsPage],
	);
}

function camelToCapitalCase(str: string) {
	return str
		.replace(/[-_]/g, " ")
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (match: string) => match.toUpperCase())
		.replace(/\s./g, (match: string) => match.toUpperCase());
}

function slugifyPageName(str: string) {
	return slugify(str.replaceAll("_", "-").replace(/^\d{2}/, ""), {
		lower: true,
		strict: true,
	});
}

type SortablePage = {
	tocOrder?: number;
	_raw: { flattenedPath: string };
	title: string;
};
function sortPages(a: SortablePage, b: SortablePage) {
	const aOrder = a.tocOrder ?? 999;
	const bOrder = b.tocOrder ?? 999;
	if (aOrder === bOrder) {
		const aFilename =
			a._raw.flattenedPath.split("/").slice(-1).at(0) ?? a.title;
		const bFilename =
			b._raw.flattenedPath.split("/").slice(-1).at(0) ?? b.title;
		return aFilename.localeCompare(bFilename);
	}
	return aOrder - bOrder;
}
