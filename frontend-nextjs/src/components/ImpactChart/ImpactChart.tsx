import { cn } from "@/utility/classNames";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { scaleLinear, scaleSqrt } from "d3-scale";
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
			totalHeightInRem,
			negativeAreaHeightInRem,
			positiveAreaHeightInRem,
			sizeScale: scaleSqrt()
				.domain([highestValue, lowestValue])
				.range([0, totalHeightInRem]),
			fillOpacityScale: scaleLinear()
				.domain([Math.max(negativeAreaHeightInRem, positiveAreaHeightInRem), 0])
				.range([0.35, 1]),
		};
	}, [props.columns]);
	return (
		<div className="flex flex-col gap-6">
			<div
				className={cn(
					"grid gap-x-px bg-grayLight border border-grayLight h-96 overflow-clip",
					"grid-cols-1",
					props.columns.length === 2 && "md:grid-cols-2",
					props.columns.length === 3 && "md:grid-cols-2 lg:grid-cols-3",
				)}
			>
				{props.columns.map(
					({ id, data, limitations, isPending, error }, idx) => {
						return (
							<ImpactChartColumnVisualisation
								key={`column-${id}`}
								id={`column-${id}`}
								impacts={data}
								limitations={limitations}
								error={error}
								isPending={isPending}
								{...scaleProps}
								itemsCountPerColumn={props.itemsCountPerColumn ?? 1}
								paddingInRem={paddingInRem}
								colIdx={idx}
							/>
						);
					},
				)}
			</div>
			<div
				className={cn(
					"grid gap-x-px",
					"grid-cols-1",
					props.columns.length === 2 && "md:grid-cols-2",
					props.columns.length === 3 && "md:grid-cols-2 lg:grid-cols-3",
				)}
			>
				{props.columns.map(
					(
						{ id, data, limitations, org, isPending, error, onOrgChange },
						idx,
					) => {
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
								colIdx={idx}
							/>
						);
					},
				)}
			</div>
		</div>
	);
}

export default ImpactChart;
