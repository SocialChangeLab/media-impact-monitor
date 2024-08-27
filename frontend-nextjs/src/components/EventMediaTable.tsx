"use client";
import { format } from "@/utility/dateUtil";
import type { ParsedFullTextType } from "@/utility/fullTextsUtil";
import { useFullTexts } from "@/utility/useFullTexts";
import { createColumnHelper } from "@tanstack/react-table";
import DataTableWithState from "./DataTable";
import ExternalLink from "./ExternalLink";
import SentimentLabel from "./SentimentLabel";
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const columnHelper = createColumnHelper<ParsedFullTextType>();

//  {
// 	"title": "Klima: Aktivisten streiken gemeinsam mit Personal des Nahverkehrs",
// 	"date": "2024-02-20",
// 	"url": "https://www.zeit.de/news/2024-02/20/aktivisten-streiken-gemeinsam-mit-personal-des-nahverkehrs",
// 	"text": "Schulterschluss zwischen Klimaaktivisten und dem Personal des öffentlichen Nahverkehrs in Dresden: Die Initiative Fridays for Future (FFF) will am 1. März gemeinsam mit Beschäftigten des öffentlichen Personennahverkehrs (ÖPNV) in Dresden auf die Straße gehen. Unter dem Motto \"Wir fahren zusammen\" wurde am Dienstag für eine Kundgebung an der Staatskanzlei geworben. Dann soll auch eine Petition an die Politik übergeben werden. Fridays for Future und die Gewerkschaft Verdi forderten gute Arbeitsbedingungen und mehr Personal sowie \"Mobilität für alle\" und eine Verdopplung des ÖPNV. Die Aktion in Dresden ist Teil eines bundesweiten Aktionstages.\n\"Klimakrise und soziale Fragen wurden viel zu lange gegeneinander ausgespielt, doch sie können nur zusammen gelöst werden. Das sehen wir auch seit Jahren im öffentlichen Nahverkehr, der immer weiter kaputtgespart wird: Fürs Klima brauchen wir eine radikale Mobilitätswende - das geht nur mit mehr Bus und Bahn\", argumentierte FFF-Sprecherin Elisabeth Jancke. Die Arbeitsbedingungen im Nahverkehr seien \"katastrophal\". Es sei kein Wunder, dass es an Beschäftigten fehle. \"Deswegen gehen wir gemeinsam mit den Beschäftigten auf die Straße und fordern faire Arbeitsbedingungen und einen guten Nahverkehr, der alle mitnimmt.\"\nFridays for Future zitierte in der Ankündigung einen Dresdner Straßenbahnfahrer, der schlechte Arbeitsbedingungen und eine hohe Arbeitsbelastung kritisierte und als Beleg den Krankenstand der Beschäftigten anführte. \"Bis 2030 werden bundesweit zehntausende Beschäftigte im Nahverkehr fehlen.\" Dadurch würden die Jobs stressiger, die Dienste länger und die Zeit für Pausen und Fahrgäste kürzer\", so der Straßenbahnfahrer. Die Kolleginnen und Kollegen seien täglich für die Fahrgäste im Einsatz, doch aktuell verteile sich die Verantwortung auf viel zu wenige Schultern.\n© dpa-infocom, dpa:240220-99-55290/2\nSchulterschluss zwischen Klimaaktivisten und dem Personal des öffentlichen Nahverkehrs in Dresden: Die Initiative Fridays for Future (FFF) will am 1. März gemeinsam mit Beschäftigten des öffentlichen Personennahverkehrs (ÖPNV) in Dresden auf die Straße gehen. Unter dem Motto \"Wir fahren zusammen\" wurde am Dienstag für eine Kundgebung an der Staatskanzlei geworben. Dann soll auch eine Petition an die Politik übergeben werden. Fridays for Future und die Gewerkschaft Verdi forderten gute Arbeitsbedingungen und mehr Personal sowie \"Mobilität für alle\" und eine Verdopplung des ÖPNV. Die Aktion in Dresden ist Teil eines bundesweiten Aktionstages.",
// 	"activism_sentiment": 1.0,
// 	"policy_sentiment": 1.0
// }
const columns = [
	columnHelper.accessor("title", {
		header: "Title",
		cell: (info) => {
			const title = info.getValue();
			if (title.length < 100)
				return <strong className="font-bold">{title}</strong>;
			return (
				<Tooltip delayDuration={50}>
					<TooltipTrigger className="w-fit text-left">
						<strong className="font-bold">{`${title.slice(0, 100)}...`}</strong>
					</TooltipTrigger>
					<Portal>
						<TooltipContent className="max-w-96 relative">
							<strong>{title}</strong>
						</TooltipContent>
					</Portal>
				</Tooltip>
			);
		},
		size: 300,
	}),
	columnHelper.accessor("text", {
		header: "Summary",
		cell: ({ getValue, row }) => {
			const title = row.original.title;
			const text = getValue();
			return (
				<Tooltip delayDuration={50}>
					<TooltipTrigger className="w-fit text-left">
						{text.length > 200 ? `${text.slice(0, 200)}...` : text}
					</TooltipTrigger>
					<Portal>
						<TooltipContent className="max-w-96 relative">
							<strong className="uppercase tracking-wide text-[0.75rem] mt-2 text-grayDark font-normal block">
								Summary
							</strong>
							<h4 className="font-semibold text-base leading-tight mb-2">
								{title}
							</h4>
							<p>{getValue()}</p>
							<div
								className="h-16 inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent sticky translate-y-2 pointer-events-none"
								aria-hidden="true"
							/>
						</TooltipContent>
					</Portal>
				</Tooltip>
			);
		},
		size: 500,
	}),
	columnHelper.accessor("date", {
		header: "Date",
		cell: (info) => (
			<span className="whitespace-nowrap">
				{format(info.getValue(), "LLL. d, yyyy")}
			</span>
		),
		size: 100,
	}),
	columnHelper.accessor("url", {
		header: "URL",
		cell: ({ getValue }) => <ExternalLink href={getValue()} />,
		size: 300,
	}),
	columnHelper.accessor("activism_sentiment", {
		header: "Sent. Activism",
		cell: (info) => {
			const sentiment = info.getValue();
			return sentiment ? <SentimentLabel sentiment={sentiment} /> : "-";
		},
		size: 50,
	}),
	columnHelper.accessor("policy_sentiment", {
		header: "Sent. Policy",
		cell: (info) => {
			const sentiment = info.getValue();
			return sentiment ? <SentimentLabel sentiment={sentiment} /> : "-";
		},
		size: 50,
	}),
];

function EventMediaTable({ id }: { id: string }) {
	const q = useFullTexts({ event_id: id });
	const query = {
		...q,
		data: q.data ?? null,
		columns,
	};
	return <DataTableWithState {...query} />;
}

export default EventMediaTable;
