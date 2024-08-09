import { cn } from "@/utility/classNames";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { Fragment, useCallback, useMemo } from "react";
import ImpactBar from "./ImpactBar";
import ImpactChartRow from "./ImpactChartRow";

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
	const height = 400;
	const padding = 32;

	const columnItems = useMemo(
		() =>
			props.columns.flatMap((columnItem) => {
				const itemsPerGroup = Math.max(
					...props.columns.map((item) => item?.data?.length ?? 1),
				);
				if (!columnItem.data) return new Array(itemsPerGroup).fill(null);
				return columnItem.data;
			}) as (ImpactChartColumnItem | null)[],
		[props.columns],
	);

	const impactScale = useCallback(
		(impact: number) => {
			const impacts = getItemsImpacts(columnItems);
			const lowestImpact = Math.min(...impacts);
			const highestImpact = Math.max(...impacts);
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
		if (props.columns.length === 0) return [];
		const itemsPerGroup = Math.max(
			...props.columns.map((item) => item?.data?.length ?? 1),
		);
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
		<div className="flex flex-col mb-6">
			<style jsx global>{`
				${columnItems
					.map((item) =>
						item
							? `
						.impact-chart-container:has(.${item.uniqueId}-item:hover) .${item.uniqueId}-show {
							opacity: 1;
						}
						.impact-chart-container:has(.${item.uniqueId}-item:hover) .${item.uniqueId}-hide {
							opacity: 0;
						}
					`
							: "",
					)
					.join("\n")}
			`}</style>
			<div
				className={cn(
					"impact-chart-container bg-grayUltraLight overflow-clip border border-grayLight",
					"grid grid-flow-col grid-rows-[1fr_minmax(4rem,auto)] w-full h-full",
				)}
				style={{
					height: `${height}px`,
					gridTemplateColumns: items
						.map(({ type }) => (type === "separator" ? "3px" : "1fr"))
						.join(" "),
				}}
			>
				{items.map(({ type, item, key }) => {
					const commonCSSClasses = cn("size-full min-h-2");
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
					const impactInHeightPercentage = impactScale(item?.impact.mean ?? 0);
					const itemClass = `${item?.uniqueId ?? "unknown"}-item`;
					const itemIsCertainAndPositive = !!item && item.impact.mean > 0;
					const itemIsCertainAndNegative = !!item && item.impact.mean < 0;
					return (
						<Fragment key={key}>
							{itemIsCertainAndNegative && (
								<div
									className={cn(itemClass, commonCSSClasses, oddCSSClasses)}
								/>
							)}
							{!!item && (
								<div
									key={item.uniqueId}
									className={cn(
										itemClass,
										commonCSSClasses,
										"flex items-end px-4 group",
										itemIsCertainAndNegative && "-scale-y-100",
										itemIsCertainAndPositive && oddCSSClasses,
									)}
									style={{ paddingTop: `${padding}px` }}
								>
									<ImpactBar
										{...item}
										impact={item?.impact.mean ?? 0}
										uncertainty={0}
										totalHeight={height - padding * 2}
										barHeight={Math.abs(impactInHeightPercentage)}
										uncertaintyHeight={0}
									/>
								</div>
							)}
							{itemIsCertainAndPositive && (
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
				{props.columns.map(
					({ id, data, limitations, org, error, onOrgChange }) => {
						return (
							<div key={`column-${id}`} className="pt-6">
								<ImpactChartRow
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
		</div>
	);
}

export default ImpactChart;
