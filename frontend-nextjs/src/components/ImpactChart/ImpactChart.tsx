import { cn } from "@/utility/classNames";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { type ScaleLinear, scaleSqrt } from "d3-scale";
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
			yAxisScale: scaleSqrt()
				.domain([highestValue, lowestValue])
				.range([lowestValue, highestValue]),
			sizeScale: scaleSqrt()
				.domain([highestValue, lowestValue])
				.range([0, totalHeightInRem]),
			fillOpacityScale: scaleSqrt()
				.domain([totalHeightInRem, 0])
				.range([0.2, 1]),
		};
	}, [props.columns]);
	return (
		<div className="flex flex-col gap-6">
			<div
				className={cn(
					"grid gap-x-px bg-grayLight h-96 overflow-clip",
					"grid-cols-[2rem_1fr] border-r border-grayLight",
					props.columns.length === 2 && "md:grid-cols-[2rem_repeat(2,1fr)]",
					props.columns.length === 3 &&
						"md:grid-cols-[2rem_repeat(2,1fr)] lg:grid-cols-[2rem_repeat(3,1fr)]",
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
					"grid-cols-[2rem_1fr]",
					props.columns.length === 2 && "md:grid-cols-[2rem_repeat(2,1fr)]",
					props.columns.length === 3 &&
						"md:grid-cols-[2rem_repeat(2,1fr)] lg:grid-cols-[2rem_repeat(3,1fr)]",
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
	const twentyPercentOfRange = sizeScale.domain()[0] * 1.5 * 0.3;
	const scaleStart = roundByDigits(
		sizeScale.domain()[0] + twentyPercentOfRange,
	);
	const scaleEnd = roundByDigits(sizeScale.domain()[1] - twentyPercentOfRange);
	const ticks = yAxisScale.ticks(4);
	return (
		<div className={cn("py-16 pr-2 bg-bg")}>
			<div
				className={cn(
					"relative transition-opacity",
					isPending ? "opacity-0" : "opacity-100",
				)}
			>
				<ImpactChartXAxisTick
					value={scaleStart}
					top={`${sizeScale(scaleStart) - 0.75}rem`}
				/>
				{ticks.map((tick, idx) => (
					<ImpactChartXAxisTick
						value={tick}
						top={`${sizeScale(tick) - 0.75}rem`}
						key={`size-scale-tick-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							idx
						}`}
					/>
				))}
				<ImpactChartXAxisTick
					value={scaleEnd}
					top={`${sizeScale(scaleEnd) - 0.75}rem`}
				/>
			</div>
		</div>
	);
}

function ImpactChartXAxisTick({ value, top }: { value: number; top: string }) {
	return (
		<div
			className={cn("text-sm text-grayDark", "absolute right-0")}
			style={{ top }}
		>
			{value}
		</div>
	);
}

function roundByDigits(number: number) {
	if (number === 0) return 0;
	const digits = Math.floor(Math.log10(Math.abs(number))) + 1;
	const factor = 10 ** (digits - 1);
	return Math.round(number / factor) * factor;
}

export default ImpactChart;
