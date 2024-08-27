import { cn } from "@/utility/classNames";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { type ScaleLinear, scaleLinear } from "d3-scale";
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

		const sizeScale = scaleLinear()
			.domain([highestValue, lowestValue])
			.range([0 + paddingInRem, fullHeightInclPadding - paddingInRem]);

		return {
			totalHeightInRem,
			negativeAreaHeightInRem,
			positiveAreaHeightInRem,
			sizeScale,
			yAxisScale: scaleLinear()
				.domain([
					highestValue + sizeScale.invert(paddingInRem),
					lowestValue - sizeScale.invert(paddingInRem),
				])
				.range([paddingInRem / 2, fullHeightInclPadding - paddingInRem / 2]),
			fillOpacityScale: (pVal: number) =>
				Math.max(Math.log10(Math.max(0.001, pVal)) / -3, 0.1),
		};
	}, [props.columns]);
	return (
		<div className="flex flex-col gap-6">
			<div
				className={cn(
					"grid gap-x-px bg-grayLight h-96 overflow-clip",
					"grid-cols-[4rem_1fr] border-r border-grayLight",
					props.columns.length === 2 && "md:grid-cols-[4rem_repeat(2,1fr)]",
					props.columns.length === 3 &&
						"md:grid-cols-[4rem_repeat(2,1fr)] lg:grid-cols-[4rem_repeat(3,1fr)]",
				)}
			>
				<ImpactChartYAxis
					{...scaleProps}
					isPending={props.columns.some((c) => c.isPending)}
				/>
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
								colIdx={idx}
								heightInRem={fullHeightInclPadding}
							/>
						);
					},
				)}
			</div>
			<div
				className={cn(
					"grid gap-x-px",
					"grid-cols-[4rem_1fr]",
					props.columns.length === 2 && "md:grid-cols-[4rem_repeat(2,1fr)]",
					props.columns.length === 3 &&
						"md:grid-cols-[4rem_repeat(2,1fr)] lg:grid-cols-[4rem_repeat(3,1fr)]",
				)}
			>
				<div />
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

function ImpactChartYAxis({
	yAxisScale,
	sizeScale,
	isPending,
}: {
	yAxisScale: ScaleLinear<number, number, never>;
	sizeScale: ScaleLinear<number, number, never>;
	isPending: boolean;
}) {
	const ticks = yAxisScale.ticks(5);
	return (
		<div className={cn("pr-2 bg-pattern-soft")}>
			<div
				className={cn(
					"relative transition-opacity size-full",
					isPending ? "opacity-0" : "opacity-100",
				)}
			>
				{ticks.map((tick, idx) => (
					<ImpactChartXAxisTick
						value={tick}
						top={`${sizeScale(tick)}rem`}
						key={`size-scale-tick-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							idx
						}`}
					/>
				))}
			</div>
		</div>
	);
}

function ImpactChartXAxisTick({ value, top }: { value: number; top: string }) {
	return (
		<div
			className={cn(
				"text-sm text-grayDark flex items-center justify-end",
				"absolute right-0 h-px w-full text-right",
			)}
			style={{ top }}
		>
			<span>
				{value === 0 ? "" : value > 0 ? "+" : "-"}
				{Math.abs(value).toLocaleString("en-GB")}
			</span>
		</div>
	);
}

export default ImpactChart;
