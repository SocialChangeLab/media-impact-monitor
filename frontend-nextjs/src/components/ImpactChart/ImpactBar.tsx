"use client";
import { cn } from "@/utility/classNames";
import useElementSize from "@custom-react-hooks/use-element-size";
import { memo } from "react";

type ImpactBarProps = {
	uniqueId: string;
	impact: number | null;
	color?: string;
	uncertainy: number | null;
};
type ImpactBarHeadProps = ImpactBarProps & {
	impactHeight: number;
	parentHeight: number;
};

function ImpactBar(props: ImpactBarProps) {
	const [parentRef, size] = useElementSize();
	const { impact } = props;
	if (impact === null) return null;
	const impactHeight = Math.ceil(
		(Math.max(0, Math.min(100, impact * 100)) * size.height) / 100,
	);
	return (
		<div ref={parentRef} className="flex items-end w-full h-56">
			<div
				className={cn("size-full grid grid-cols-1 grid-rows-[auto_1fr]")}
				style={{ height: props.uncertainy === null ? 4 : `${impactHeight}px` }}
			>
				<ImpactBarHead
					{...props}
					impactHeight={props.uncertainy === null ? 4 : impactHeight}
					parentHeight={size.height}
				/>
			</div>
		</div>
	);
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
	uncertainy,
	parentHeight,
	uniqueId,
	color = "bg-grayMed",
}: ImpactBarHeadProps) {
	const tooUncertain = uncertainy === null;
	const height = Math.ceil(parentHeight * (uncertainy ?? 1));
	const pathNoCertainty = `M0 0 L100 0 L100 ${height} L0 ${height}`;
	const pathWithUncertainty = `M-10 13 L50 0 L110 13 L100 ${height} L50 ${
		height - 11
	} L0 ${height}`;
	return (
		<div
			className={cn(
				"size-full",
				"absolute top-0 left-0 opacity-0 transition-opacity duration-1000 ease-smooth-in-out group-hover:opacity-100",
			)}
			style={{
				height,
				transform: `translateY(-${Math.ceil(height / 2) - 9}px)`,
			}}
		>
			<svg
				viewBox={`0 0 100 ${height}`}
				preserveAspectRatio="none"
				height={16}
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
							patternTransform="rotate(45) scale(2)"
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
						<stop offset="0.5" stopColor="white" stopOpacity="1" />
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
					d={uncertainy === null ? pathNoCertainty : pathWithUncertainty}
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
	uncertainy,
	impactHeight,
	uniqueId,
}: ImpactBarHeadProps) {
	const pathNoCertainty = `M0 0 L100 0 L0 0`;
	const pathWithUncertainty = `M0 16 L50 0 L100 16 L100 ${impactHeight} L0 ${impactHeight}`;
	const polylineNoCertainty = `0 2 100 2`;
	const polylineWithUncertainty = `0 14 50 3 100 14`;

	return (
		<svg
			viewBox={`0 0 100 ${impactHeight}`}
			height={uncertainy === null ? 4 : impactHeight}
			preserveAspectRatio="none"
			className={cn("w-full shrink-0 grow-0")}
			style={{ color }}
			aria-hidden="true"
			data-impactheight={impactHeight}
			data-uncertainy={uncertainy}
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
				d={uncertainy === null ? pathNoCertainty : pathWithUncertainty}
				fill="currentColor"
				fillOpacity={0.3}
				strokeWidth="0"
				className="transition-opacity duration-1000 ease-smooth-in-out group-hover:opacity-0"
				mask={`url(#fade-bar-${uniqueId})`}
			/>
			<polyline
				points={
					uncertainy === null ? polylineNoCertainty : polylineWithUncertainty
				}
				stroke="currentColor"
				strokeWidth="4"
				fill="none"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

export default memo(ImpactBar);
