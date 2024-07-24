"use client";
import { cn } from "@/utility/classNames";
import { memo } from "react";

const PART_MIN_HEIGHT = 16;

type ImpactBarProps = {
	uniqueId: string;
	impact: number | null;
	color?: string;
	uncertainty: number | null;
	totalHeight: number;
	barHeight: number;
	uncertaintyHeight: number;
};
type ImpactBarHeadProps = ImpactBarProps & {
	impactHeight: number;
	uncertaintyHeight: number;
};

function ImpactBar(props: ImpactBarProps) {
	const { uncertainty, barHeight, uniqueId } = props;
	if (props.impact === null) return null;
	const tooUncertain = isTooUncertain(uncertainty);
	const impact = props.impact / 100;
	const impactHeight = Math.max(barHeight, PART_MIN_HEIGHT);
	const uncertaintyHeight = Math.max(PART_MIN_HEIGHT, props.uncertaintyHeight);
	const negativeImpact = impact < 0;
	return (
		<div
			className={cn(
				"pointer-events-none",
				"flex items-end w-full h-full relative",
				uncertainty === null && "translate-y-0.5",
			)}
		>
			<div
				className={cn("size-full relative")}
				style={{ height: tooUncertain ? 4 : `${impactHeight}px` }}
			>
				<ImpactBarHead
					{...props}
					impactHeight={tooUncertain ? 4 : impactHeight}
					uncertaintyHeight={uncertaintyHeight}
				/>
				{props.uncertainty && !tooUncertain && (
					<span
						className={cn(
							"absolute left-1/2 -translate-x-1/2 bottom-full -translate-y-2 text-sm",
							"transition-opacity opacity-100 group-hover:opacity-0 duration-1000 ease-smooth-in-out",
							`${uniqueId}-hide`,
						)}
					>
						<div
							className={cn(negativeImpact && !tooUncertain && `-scale-y-100`)}
						>
							{props.impact > 0
								? `+${props.impact.toFixed(2)}`
								: props.impact.toFixed(2)}
						</div>
					</span>
				)}
				<span
					className={cn(
						"absolute left-1/2 text-sm text-center ",
						"transition-opacity opacity-0 group-hover:opacity-100 duration-1000 ease-smooth-in-out",
						`${uniqueId}-show`,
						"leading-tight",
						tooUncertain || impactHeight < 80 ? "bottom-full" : "top-0",
					)}
					style={{
						transform: tooUncertain
							? `translate(-50%, -8px)`
							: impactHeight < 80
								? `translate(-50%, -${uncertaintyHeight / 2}px)`
								: `translate(-50%, ${
										uncertaintyHeight / 2 + (impact >= 0 ? 6 : 14)
									}px)`,
					}}
				>
					<div
						className={cn(negativeImpact && !tooUncertain && `-scale-y-100`)}
					>
						{getUncertaintyLabel(uncertainty)}
					</div>
				</span>
			</div>
		</div>
	);
}

export function isTooUncertain(uncertainty: number | null) {
	return uncertainty === null || Math.abs(uncertainty) > 0.6;
}

function getUncertaintyLabel(uncertainty: number | null) {
	const u = uncertainty ?? 0;
	const uFormatted = u.toFixed(2);
	if (isTooUncertain(uncertainty)) return `Too uncertain (±${uFormatted})`;
	if (u < 0.2) return `Low Uncertainty (±${uFormatted})`;
	if (u < 0.4) return `Moderate Uncertainty (±${uFormatted})`;
	return `High Uncertainty (±${uFormatted})`;
}

function ImpactBarHead(props: ImpactBarHeadProps) {
	return (
		<div className={cn("w-full relative")}>
			<ImpactArrow {...props} />
			<UncertaintyBar {...props} />
		</div>
	);
}

function UncertaintyBar({
	uncertainty,
	uncertaintyHeight,
	totalHeight,
	uniqueId,
	color = "bg-grayMed",
}: ImpactBarHeadProps) {
	const tooUncertain = isTooUncertain(uncertainty);
	const height = tooUncertain ? totalHeight : uncertaintyHeight;
	const pathNoCertainty = `M0 0 L100 0 L100 ${height} L0 ${height}`;
	const pathWithUncertainty = `M-10 13 L50 0 L110 13 L100 ${height} L50 ${
		height - 11
	} L0 ${height}`;
	return (
		<div
			className={cn(
				"size-full pointer-events-none",
				"absolute top-0 left-0 opacity-0 transition-opacity duration-1000 ease-smooth-in-out group-hover:opacity-100",
				`${uniqueId}-show`,
			)}
			style={{
				height,
				transform:
					height > PART_MIN_HEIGHT
						? `translateY(-${Math.ceil(height / 2) - 9}px)`
						: "",
			}}
		>
			<svg
				viewBox={`0 0 100 ${height}`}
				preserveAspectRatio="none"
				height={PART_MIN_HEIGHT}
				className={cn("size-full shrink-0 grow-0")}
				style={{ color }}
				aria-hidden="true"
			>
				<defs>
					{tooUncertain && (
						<pattern
							id={`diagonalHatch-${uniqueId}`}
							width="4"
							height="4"
							patternUnits="userSpaceOnUse"
							patternTransform="rotate(45) scale(4)"
						>
							<rect
								width="2"
								height="4"
								transform="translate(0,0)"
								fill="white"
							/>
						</pattern>
					)}
					<linearGradient id={`fadeGradUncertainty-${uniqueId}`} y2="1" x2="0">
						<stop
							offset="0"
							stopColor="white"
							stopOpacity={tooUncertain ? 0 : 0.3}
						/>
						<stop
							offset="0.5"
							stopColor="white"
							stopOpacity={tooUncertain ? 0.5 : 1}
						/>
						<stop
							offset="1"
							stopColor="white"
							stopOpacity={tooUncertain ? 0 : 0.3}
						/>
					</linearGradient>

					{tooUncertain && (
						<mask id={`fade-pattern-mask-${uniqueId}`}>
							<rect
								x="0"
								y="0"
								width={100}
								height={height}
								fill={`url(#diagonalHatch-${uniqueId})`}
							/>
						</mask>
					)}

					<mask id={`fade-uncertainty-${uniqueId}`}>
						<rect x="0" y="0" width="100%" height="100%" fill="black" />
						<rect
							x="0"
							y="0"
							width="100%"
							height="100%"
							fill={`url(#fadeGradUncertainty-${uniqueId})`}
							mask={
								tooUncertain ? `url(#fade-pattern-mask-${uniqueId})` : undefined
							}
						/>
					</mask>
				</defs>
				<path
					d={tooUncertain ? pathNoCertainty : pathWithUncertainty}
					fill="currentColor"
					fillOpacity={0.3}
					strokeWidth="0"
					mask={`url(#fade-uncertainty-${uniqueId})`}
				/>
			</svg>
		</div>
	);
}

function ImpactArrow({
	color,
	uncertainty,
	impactHeight,
	uniqueId,
}: ImpactBarHeadProps) {
	const tooUncertain = isTooUncertain(uncertainty);
	const pathNoCertainty = `M0 0 L100 0 L0 0`;
	const pathWithUncertainty = `M0 16 L50 0 L100 16 L100 ${impactHeight} L0 ${impactHeight}`;
	const polylineNoCertainty = `0 2 100 2`;
	const polylineWithUncertainty = `0 14 50 3 100 14`;

	return (
		<svg
			viewBox={`0 0 100 ${impactHeight}`}
			height={tooUncertain ? 4 : impactHeight}
			preserveAspectRatio="none"
			className={cn("w-full shrink-0 grow-0")}
			style={{ color }}
			aria-hidden="true"
			data-impactheight={impactHeight}
			data-uncertainty={uncertainty}
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
				d={tooUncertain ? pathNoCertainty : pathWithUncertainty}
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
				points={tooUncertain ? polylineNoCertainty : polylineWithUncertainty}
				stroke="currentColor"
				strokeWidth="4"
				fill="none"
				vectorEffect="non-scaling-stroke"
				className={cn(
					`${uniqueId}-show`,
					tooUncertain &&
						"opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-smooth-in-out",
				)}
			/>
		</svg>
	);
}

export default memo(ImpactBar);
