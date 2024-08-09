"use client";
import { cn } from "@/utility/classNames";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { memo } from "react";

const PART_MIN_HEIGHT = 16;

type ImpactBarProps = ParsedMediaImpactItemType & {
	totalHeight: number;
	barHeight: number;
};
type ImpactBarHeadProps = ImpactBarProps & {
	impactHeight: number;
};

function ImpactBar(props: ImpactBarProps) {
	const { barHeight, uniqueId } = props;
	if (props.impact === null) return null;
	const impact = props.impact.mean / 100;
	const impactHeight = Math.max(barHeight, PART_MIN_HEIGHT);
	const negativeImpact = impact < 0;
	return (
		<div
			className={cn(
				"pointer-events-none",
				"flex items-end w-full h-full relative transition",
				`topic-chart-item topic-chart-item-topic-${props.topicSlug}`,
			)}
		>
			<div
				className={cn("size-full relative")}
				style={{ height: `${impactHeight}px` }}
			>
				<ImpactBarHead {...props} impactHeight={impactHeight} />
				<span
					className={cn(
						"absolute left-1/2 -translate-x-1/2 bottom-full -translate-y-2 text-sm",
						"transition-opacity opacity-100 group-hover:opacity-0 duration-1000 ease-smooth-in-out",
						`${uniqueId}-hide`,
					)}
				>
					<div className={cn(negativeImpact && `-scale-y-100`)}>
						{props.impact.mean > 0
							? `+${props.impact.mean.toFixed(2)}`
							: props.impact.mean.toFixed(2)}
					</div>
				</span>
			</div>
		</div>
	);
}

export function isTooUncertain(uncertainty: number | null) {
	return uncertainty === null || Math.abs(uncertainty) > 100;
}

function ImpactBarHead(props: ImpactBarHeadProps) {
	return (
		<div className={cn("w-full relative")}>
			<ImpactArrow {...props} />
		</div>
	);
}

function ImpactArrow({ color, impactHeight, uniqueId }: ImpactBarHeadProps) {
	const pathWithUncertainty = `M0 16 L50 0 L100 16 L100 ${impactHeight} L0 ${impactHeight}`;
	const polylineWithUncertainty = `0 14 50 3 100 14`;

	return (
		<svg
			viewBox={`0 0 100 ${impactHeight}`}
			height={impactHeight}
			preserveAspectRatio="none"
			className={cn("w-full shrink-0 grow-0")}
			style={{ color }}
			aria-hidden="true"
			data-impactheight={impactHeight}
		>
			<defs>
				<linearGradient id={`fadeGradBar-${uniqueId}`} y2="1" x2="0">
					<stop offset="0" stopColor="white" stopOpacity="1" />
					<stop offset="1" stopColor="white" stopOpacity="0.5" />
				</linearGradient>

				<mask id="fade-bar" maskContentUnits="objectBoundingBox">
					<rect width="1" height="1" fill={`url(#fadeGradBar-${uniqueId})`} />
				</mask>
			</defs>
			<path
				d={pathWithUncertainty}
				fill="currentColor"
				fillOpacity={0.3}
				strokeWidth="0"
				className={cn(
					"transition-opacity duration-1000 ease-smooth-in-out group-hover:opacity-0",
					`${uniqueId}-hide`,
				)}
				mask={`url(#fade-bar-${uniqueId})`}
			/>
			<polyline
				points={polylineWithUncertainty}
				stroke="currentColor"
				strokeWidth="4"
				fill="none"
				vectorEffect="non-scaling-stroke"
				className={cn(`${uniqueId}-show`)}
			/>
		</svg>
	);
}

export default memo(ImpactBar);
