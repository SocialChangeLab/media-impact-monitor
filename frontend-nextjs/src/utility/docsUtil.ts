import { type DocsPage, allDocsPages } from "contentlayer/generated";

export type ChartDocsPage = {
	slug: string;
	title: string;
	tocOrder?: number;
	isChartPage: true;
	intro: DocsPage;
	info: DocsPage;
	methodology: DocsPage;
	data: DocsPage;
};

export type NonChartDocsPage = DocsPage & {
	isChartPage: false;
};

export type HierarchizedDocsPage = NonChartDocsPage | ChartDocsPage;

const chartPageKey = "charts";

export function getAllDocsPages() {
	const pagesMap = allDocsPages.reduce((acc, doc) => {
		const path = doc._raw.flattenedPath.split("/").slice(1);
		if (path.length === 0) return acc;
		if (path[0] !== chartPageKey) {
			acc.set(doc.slug, { ...doc, isChartPage: false });
			return acc;
		}
		if (path.length !== 3) return acc;
		const [_base, chartName, section] = path;
		const existingChartPage = acc.get(chartName);
		const chartPage = existingChartPage as ChartDocsPage | undefined;
		acc.set(chartName, {
			slug: chartName,
			title: `${camelToCapitalCase(chartName)} Chart`,
			isChartPage: true,
			intro: (section === "intro" && doc) || (chartPage?.intro as DocsPage),
			methodology:
				(section === "methodology" && doc) ||
				(chartPage?.methodology as DocsPage),
			data: (section === "data" && doc) || (chartPage?.data as DocsPage),
			info: (section === "info" && doc) || (chartPage?.info as DocsPage),
		});
		return acc;
	}, new Map<string, HierarchizedDocsPage>());
	return Array.from(pagesMap.values());
}

export function getDocsPage(slug: string) {
	const docsPage = getAllDocsPages().find((docsPage) => docsPage.slug === slug);
	return docsPage || null;
}

export function getDocsToc(): (
	| HierarchizedDocsPage
	| {
			title: string;
			slug: string;
			children: HierarchizedDocsPage[];
			tocOrder?: number;
	  }
)[] {
	const docsPages = getAllDocsPages();
	const chartPages = docsPages.filter(
		(docsPage) => docsPage.isChartPage,
	) as ChartDocsPage[];
	const nonChartPages = docsPages.filter(
		(docsPage) => !docsPage.isChartPage,
	) as NonChartDocsPage[];
	return [
		...nonChartPages,
		{
			title: "Charts",
			slug: chartPages[0].slug,
			children: chartPages,
			tocOrder: 2,
		},
	].sort((a, b) => {
		const aOrder = a.tocOrder ?? 999;
		const bOrder = b.tocOrder ?? 999;
		if (aOrder === bOrder) return a.title.localeCompare(b.title);
		return aOrder - bOrder;
	});
}

export function getDocsFlatToc() {
	const docsPages = getAllDocsPages();
	return docsPages
		.flatMap((docsPage) =>
			"children" in docsPage && docsPage.children
				? (docsPage.children as ChartDocsPage[])
				: [docsPage],
		)
		.map((docsPage) => ({
			slug: docsPage.slug,
			title: docsPage.title,
			isChartPage: docsPage.isChartPage,
		}));
}

function camelToCapitalCase(str: string) {
	return str
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (match: string) => match.toUpperCase())
		.replace(/\s./g, (match: string) => match.toUpperCase());
}
