import HeadlineWithLine from "./HeadlineWithLine";

function DataCreditLegend({
	title = "Data credit",
	sources = [],
}: {
	title?: string;
	sources?: {
		label: string;
		links: { text: string; url: string }[];
	}[];
}) {
	if (sources.length === 0) return null;
	return (
		<div className="flex flex-col gap-4 w-full sm:w-96">
			<HeadlineWithLine>{title}</HeadlineWithLine>
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
		</div>
	);
}

export default DataCreditLegend;
