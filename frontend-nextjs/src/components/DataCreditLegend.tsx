import { texts } from "@/utility/textUtil";
import CollapsableSection from "./CollapsableSection";

export type DataCreditLegendSource = {
	label: string;
	links: { text: string; url: string }[];
};

function DataCreditLegend({
	title = texts.charts.common.dataCredit,
	storageKey = "data-credits-expanded",
	sources = [],
}: {
	title?: string;
	storageKey?: string;
	sources?: DataCreditLegendSource[];
}) {
	if (sources.length === 0) return null;
	return (
		<>
			<CollapsableSection
				title={title}
				storageKey={storageKey}
				storageType="session"
				className="flex flex-col gap-4 w-full"
				defaultExpanded={false}
			>
				<div className="flex gap-8 justify-stretch flex-wrap">
					{sources.map(({ label, links }) => (
						<div key={label} className="grow flex flex-col">
							<strong className="font-bold block pb-2">{label}:</strong>
							{links.map(({ text, url }) => (
								<a
									key={text}
									href={url}
									title={`Website of the ${label} source "${text}" (${url}) for this chart`}
									className="underline mb-2 focusable"
								>
									{text}
								</a>
							))}
						</div>
					))}
				</div>
			</CollapsableSection>
		</>
	);
}

export default DataCreditLegend;
