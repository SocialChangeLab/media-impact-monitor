import CollapsableSection from "./CollapsableSection";

function DataCreditLegend({
	title = "Data credit",
	storageKey = "data-credits-expanded",
	sources = [],
}: {
	title?: string;
	storageKey?: string;
	sources?: {
		label: string;
		links: { text: string; url: string }[];
	}[];
}) {
	if (sources.length === 0) return null;
	return (
		<>
			<CollapsableSection
				title={title}
				storageKey={storageKey}
				storageType="session"
				className="flex flex-col gap-4 w-full sm:w-80"
			>
				<div className="flex gap-8 justify-stretch flex-wrap">
					{sources.map(({ label, links }) => (
						<div key={label} className="grow flex flex-col">
							<strong className="font-bold block pb-2">Media data:</strong>
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
