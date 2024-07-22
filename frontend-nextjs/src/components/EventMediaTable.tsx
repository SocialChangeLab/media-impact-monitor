"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import DataTableWithState from "./DataTable";
import ExternalLink from "./ExternalLink";
import SentimentLabel from "./SentimentLabel";

type MediaType = {
	id: string;
	name: string;
	url: string;
	description: string;
	date: string;
	sentiment: number;
};

const columnHelper = createColumnHelper<MediaType>();

const columns = [
	columnHelper.accessor("name", {
		header: "Title",
		cell: (info) => <strong className="font-bold">{info.getValue()}</strong>,
		size: 200,
	}),
	columnHelper.accessor("description", {
		header: "Summary",
		cell: (info) => info.getValue(),
		size: 500,
	}),
	columnHelper.accessor("date", {
		header: "Date",
		cell: (info) => (
			<span className="whitespace-nowrap">
				{format(info.getValue(), "LLLL d, yyyy")}
			</span>
		),
		size: 100,
	}),
	columnHelper.accessor("url", {
		header: "URL",
		cell: ({ getValue }) => <ExternalLink href={getValue()} />,
		size: 300,
	}),
	columnHelper.accessor("sentiment", {
		header: "Sentiment",
		cell: (info) => <SentimentLabel sentiment={info.getValue()} />,
		size: 50,
	}),
];

const data = [
	{
		id: "1",
		name: "Media Cloud",
		url: "https://mediacloud.org/",
		description:
			"Global open source media collection to understand the content, context, and impact of news stories.",
		date: "2023-06-01T00:00:00.000Z",
		sentiment: 0.9,
	},
	{
		id: "2",
		name: "Genios",
		url: "https://www.genios.de/browser/",
		description:
			"Text-searchable archives of newspapers and other media content for numerous organizations.",
		date: "2023-07-01T00:00:00.000Z",
		sentiment: 0.4,
	},
	{
		id: "3",
		name: "Nexis",
		url: "https://www.lexisnexis.com/en-us/professional/research/Users/vogelino/repos/media-impact-monitor/frontend-nextjs/node_modules/@contentlayer/core/dist/generation/generate-dotpkg.js",
		description:
			"Extensive global news, business, and legal information for research and analytics.",
		date: "2023-08-01T00:00:00.000Z",
		sentiment: 0.1,
	},
	{
		id: "4",
		name: "DeReKo (Deutsches Referenzkorpus)",
		url: "https://www.corpusfinder.ugent.be/corpus/69",
		description:
			"Modern German texts, used for linguistic research and analysis.",
		date: "2023-09-01T00:00:00.000Z",
		sentiment: 0.2,
	},
];

function EventMediaTable({ id }: { id: string }) {
	const query = {
		data,
		isPending: false,
		error: null,
		columns,
	};
	return <DataTableWithState {...query} />;
}

export default EventMediaTable;
