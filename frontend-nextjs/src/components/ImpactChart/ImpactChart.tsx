import { cn } from "@/utility/classNames";
import type { icons } from "lucide-react";
import { Fragment, useCallback, useMemo } from "react";
import ImpactBar from "./ImpactBar";
import ImpactChartRow from "./ImpactChartRow";

type ImpactChartColumnItem = {
	impact: number;
	uncertainty: number | null;
	label: string;
	color: string;
	uniqueId: string;
};

type ImpactChartColumn = {
	data: ImpactChartColumnItem[];
	id: string;
};

type ImpactChartProps = {
	columns: ImpactChartColumn[];
	unitLabel: string;
	icon: keyof typeof icons;
};

function ImpactChart(props: ImpactChartProps) {
	const height = 400;
	const padding = 32;

	const columnItems = useMemo(
		() => props.columns.flatMap((columnItem) => columnItem.data),
		[props.columns],
	);

	const impactScale = useCallback(
		(impact: number) => {
			const columnsWithValidCertainty = columnItems.filter(
				(item) => item.uncertainty !== null,
			);
			const lowestImpact = Math.min(
				...columnsWithValidCertainty.map((item) => item.impact),
			);
			const highestImpact = Math.max(
				...columnsWithValidCertainty.map((item) => item.impact),
			);
			const impactRange = Math.abs(lowestImpact) + Math.abs(highestImpact);
			const highImpactsPercentage = highestImpact / impactRange;
			const lowImpactsPercentage = Math.abs(lowestImpact) / impactRange;
			const highImpactsPixels = height * highImpactsPercentage;
			const lowImpactsPixels = height * lowImpactsPercentage;

			const absImpact = Math.abs(impact);
			const percentageOfImpact = absImpact / impactRange;
			const partInPixels = impact < 0 ? lowImpactsPixels : highImpactsPixels;
			return Math.floor(partInPixels * percentageOfImpact);
		},
		[columnItems],
	);

	const items = useMemo(() => {
		const itemsPerGroup = props.columns[0].data.length;
		const separatorsCount = Math.floor(columnItems.length / itemsPerGroup) - 2;
		let separatorsAdded = 0;
		return Array.from(
			{ length: separatorsCount + columnItems.length + 1 },
			(_, idx) => {
				const itemNumber = idx + 1;
				const isSeparator =
					itemNumber !== 1 && itemNumber % (itemsPerGroup + 1) === 0;
				isSeparator && separatorsAdded++;
				const item = {
					type: isSeparator ? "separator" : "item",
					item: isSeparator ? idx : columnItems[idx - separatorsAdded],
					key: isSeparator
						? `separator-${separatorsAdded}`
						: `item-${idx - separatorsAdded}`,
				};
				return item;
			},
		);
	}, [props.columns, columnItems]);

	return (
		<div className="flex flex-col">
			<style jsx global>{`
				${columnItems
					.map(
						(item) => `
						.impact-chart-container:has(.${item.uniqueId}-item:hover) .${item.uniqueId}-show {
							opacity: 1;
						}
						.impact-chart-container:has(.${item.uniqueId}-item:hover) .${item.uniqueId}-hide {
							opacity: 0;
						}
					`,
					)
					.join("\n")}
			`}</style>
			<div
				className={cn(
					`impact-chart-container`,
					"grid grid-flow-col grid-rows-[1fr_auto] w-full",
				)}
				style={{
					maxHeight: `${height}px`,
					gridTemplateColumns: items
						.map(({ type }) => (type === "separator" ? "3px" : "1fr"))
						.join(" "),
				}}
			>
				{items.map(({ type, item, key }) => {
					const commonCSSClasses = cn("size-full");
					const oddCSSClasses = cn("border-b border-grayLight");
					if (type === "separator" || typeof item === "number") {
						return (
							<Fragment key={key}>
								<div
									className={cn(
										commonCSSClasses,
										oddCSSClasses,
										"shrink-0 relative",
									)}
								>
									<div className="absolute top-0 left-1/2 w-px h-full bg-grayLight" />
								</div>
								<div className={cn(commonCSSClasses, "shrink-0 relative")}>
									<div className="absolute top-0 left-1/2 w-px h-full bg-grayLight" />
								</div>
							</Fragment>
						);
					}
					const columnItem = item;
					const impactInHeightPercentage = impactScale(columnItem.impact);
					const itemClass = `${columnItem.uniqueId}-item`;
					return (
						<Fragment key={key}>
							{columnItem.impact < 0 && (
								<div
									className={cn(itemClass, commonCSSClasses, oddCSSClasses)}
								/>
							)}
							<div
								key={columnItem.uniqueId}
								className={cn(
									itemClass,
									commonCSSClasses,
									`flex items-end px-4 group`,
									columnItem.impact < 0 && `-scale-y-100`,
									columnItem.impact > 0 && oddCSSClasses,
								)}
								style={{ paddingTop: `${padding}px` }}
							>
								<ImpactBar
									{...columnItem}
									totalHeight={height - padding * 2}
									barHeight={Math.abs(impactInHeightPercentage)}
								/>
							</div>
							{columnItem.impact >= 0 && (
								<div className={cn(itemClass, commonCSSClasses)} />
							)}
						</Fragment>
					);
				})}
			</div>
			<div
				className="grid"
				style={{ gridTemplateColumns: `repeat(${props.columns.length}, 1fr)` }}
			>
				{props.columns.map(({ id, data }) => {
					return (
						<div key={`column-${id}`} className="p-4">
							<ImpactChartRow
								icon={props.icon}
								impacts={data}
								unitLabel={props.unitLabel}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ImpactChart;
