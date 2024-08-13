import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { scaleSqrt } from "d3-scale";
import { useMemo } from "react";
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
	const paddingInRem = 4;
	const fullHeightInclPadding = 24;

	const scaleProps = useMemo(() => {
		const negativeValues = props.columns
			.flatMap((c) => c.data?.filter((d) => d.impact.lower < 0) ?? [])
			.map((d) => d.impact.lower);
		const positiveValues = props.columns
			.flatMap((c) => c.data?.filter((d) => d.impact.upper > 0) ?? [])
			.map((d) => d.impact.upper);
		const lowestValue = Math.min(...negativeValues, 0);
		const highestValue = Math.max(...positiveValues, 0);
		const totalValueRange = Math.abs(highestValue - lowestValue);
		const percentageOfNegativeValues =
			lowestValue === 0 ? 0 : Math.abs(lowestValue) / totalValueRange;
		const restrictedPercentageOfNegativeValues = Math.max(
			percentageOfNegativeValues,
			0.2,
		);
		const percentageOfPositiveValues = 1 - restrictedPercentageOfNegativeValues;
		const totalHeightInRem = fullHeightInclPadding - paddingInRem * 2;
		const negativeAreaHeightInRem =
			restrictedPercentageOfNegativeValues * totalHeightInRem;
		const positiveAreaHeightInRem =
			percentageOfPositiveValues * totalHeightInRem;
		return {
			negativeAreaHeightInRem,
			positiveAreaHeightInRem,
			scale: scaleSqrt()
				.domain([highestValue, lowestValue])
				.range([0, totalHeightInRem]),
		};
	}, [props.columns]);
	return (
		<div className="flex flex-col gap-6">
			<div
				className="grid gap-x-px bg-grayLight border border-grayLight h-96 overflow-clip"
				style={{ gridTemplateColumns: `repeat(${props.columns.length}, 1fr)` }}
			>
				{props.columns.map(({ id, data, limitations, isPending, error }) => {
					return (
						<ImpactChartColumnVisualisation
							key={`column-${id}`}
							impacts={data}
							limitations={limitations}
							error={error}
							isPending={isPending}
							{...scaleProps}
							itemsCountPerColumn={props.itemsCountPerColumn ?? 1}
							paddingInRem={paddingInRem}
						/>
					);
				})}
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
