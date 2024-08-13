import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import ImpactChartColumnDescriptions from "./ImpactChartColumnDescriptions";
import ImpactChartColumnVisualisation from "./ImpactChartColumnVisualisation";

type ImpactChartColumn = {
	data: ParsedMediaImpactItemType[] | null;
	id: string;
	limitations?: string[];
	error: Error | null;
	org: EventOrganizerSlugType;
	onOrgChange?: (organiser: EventOrganizerSlugType) => void;
	isPending: boolean;
};

type ImpactChartProps = {
	columns: ImpactChartColumn[];
	columnsCount?: number;
	itemsCountPerColumn?: number;
	unitLabel: string;
};

function ImpactChart(props: ImpactChartProps) {
	return (
		<div className="flex flex-col gap-6">
			<div
				className="grid gap-x-px bg-grayLight border border-grayLight h-96"
				style={{ gridTemplateColumns: `repeat(${props.columns.length}, 1fr)` }}
			>
				{props.columns.map(
					({ id, data, limitations, isPending, error, onOrgChange }) => {
						return (
							<ImpactChartColumnVisualisation
								key={`column-${id}`}
								impacts={data}
								limitations={limitations}
								error={error}
								isPending={isPending}
							/>
						);
					},
				)}
			</div>
			<div
				className="grid gap-x-px"
				style={{ gridTemplateColumns: `repeat(${props.columns.length}, 1fr)` }}
			>
				{props.columns.map(
					({ id, data, limitations, org, isPending, error, onOrgChange }) => {
						return (
							<ImpactChartColumnDescriptions
								key={`column-${id}`}
								impacts={data}
								isPending={isPending}
								unitLabel={props.unitLabel}
								limitations={limitations}
								error={error}
								defaultOrganizer={org}
								onOrgChange={onOrgChange}
								itemsCountPerColumn={props.itemsCountPerColumn}
							/>
						);
					},
				)}
			</div>
		</div>
	);
}

export default ImpactChart;
