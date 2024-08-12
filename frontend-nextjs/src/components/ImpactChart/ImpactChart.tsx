import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import ImpactChartColumnDescriptions from "./ImpactChartColumnDescriptions";

type ImpactChartColumnItem = ParsedMediaImpactItemType;

type ImpactChartColumn = {
	data: ParsedMediaImpactItemType[] | null;
	id: string;
	limitations?: string[];
	error: Error | null;
	org: EventOrganizerSlugType;
	onOrgChange?: (organiser: EventOrganizerSlugType) => void;
};

type ImpactChartProps = {
	columns: ImpactChartColumn[];
	unitLabel: string;
};

const getItemsImpacts = (items: (ParsedMediaImpactItemType | null)[]) => {
	const nonNullItems = items.filter(
		(item) => item !== null,
	) as ParsedMediaImpactItemType[];
	return nonNullItems.map((item) => item.impact.mean ?? 0) ?? [];
};

function ImpactChart(props: ImpactChartProps) {
	const height = 360;

	return (
		<div
			className="grid"
			style={{ gridTemplateColumns: `repeat(${props.columns.length}, 1fr)` }}
		>
			{props.columns.map(
				({ id, data, limitations, org, error, onOrgChange }) => {
					return (
						<div key={`column-${id}`} className="flex flex-col gap-6">
							<ImpactChartColumnDescriptions
								impacts={data}
								unitLabel={props.unitLabel}
								limitations={limitations}
								error={error}
								defaultOrganizer={org}
								onOrgChange={onOrgChange}
							/>
						</div>
					);
				},
			)}
		</div>
	);
}

export default ImpactChart;
