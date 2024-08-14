import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { seededRandom } from "@/utility/randomUtil";
import { titleCase } from "@/utility/textUtil";
import { getTopicIcon } from "@/utility/topicsUtil";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import { Asterisk } from "lucide-react";
import { useMemo } from "react";
import ComponentError from "../ComponentError";

function ImpactChartColumnVisualisation({
	id,
	impacts,
	limitations = [],
	error,
	positiveAreaHeightInRem,
	negativeAreaHeightInRem,
	totalHeightInRem,
	scale,
	itemsCountPerColumn,
	paddingInRem,
	isPending = false,
	colIdx,
}: {
	id: string;
	impacts: ParsedMediaImpactItemType[] | null;
	limitations?: string[];
	error?: Error | null;
	isPending?: boolean;
	negativeAreaHeightInRem: number;
	positiveAreaHeightInRem: number;
	totalHeightInRem: number;
	scale: ScaleLinear<number, number, never>;
	itemsCountPerColumn: number;
	paddingInRem: number;
	colIdx: number;
}) {
	const hasLimitations = useMemo(
		() => !isPending && limitations.length > 0,
		[limitations, isPending],
	);
	return (
		<ImpactChartColumnVisualisationWrapper colIdx={colIdx}>
			{isPending && (
				<ImpactChartColumnVisualisationLoading
					itemsCountPerColumn={itemsCountPerColumn}
					totalHeightInRem={totalHeightInRem}
					paddingInRem={paddingInRem}
					id={id}
				/>
			)}
			{hasLimitations && (
				<ImpactChartColumnVisualisationLimitations limitations={limitations} />
			)}
			{error && <ImpactChartColumnVisualisationError error={error} />}
			{!isPending && !hasLimitations && !error && (
				<ImpactChartColumnVisualisationImpacts
					impacts={impacts}
					negativeAreaHeightInRem={negativeAreaHeightInRem}
					positiveAreaHeightInRem={positiveAreaHeightInRem}
					scale={scale}
					itemsCountPerColumn={itemsCountPerColumn}
					paddingInRem={paddingInRem}
					id={id}
				/>
			)}
		</ImpactChartColumnVisualisationWrapper>
	);
}

function ImpactChartColumnVisualisationWrapper({
	children,
	colIdx,
}: {
	children: React.ReactNode;
	colIdx: number;
}) {
	return (
		<div
			className={cn(
				"bg-grayUltraLight h-96",
				colIdx === 1 && "max-md:hidden",
				colIdx === 2 && "max-lg:hidden",
			)}
		>
			{children}
		</div>
	);
}

function ImpactChartColumnVisualisationLimitations({
	limitations,
}: {
	limitations: string[];
}) {
	return (
		<div className="w-full h-96 flex justify-center items-center">
			<div className="flex flex-col gap-2 max-w-96">
				<div className={cn("mb-1 w-fit h-fit")}>
					<Asterisk size={48} strokeWidth={1} className="text-grayMed -ml-3" />
				</div>
				<div className="mb-1 relative min-w-full grid grid-cols-[auto,1fr] items-center gap-4">
					<strong className="font-semibold">Limitation</strong>
					<div className="h-px w-full bg-grayLight"></div>
				</div>
				<p className="text-grayDark relative">
					The impact cannot be computed because of the following limitations:
				</p>
				<ul className="flex flex-col gap-2 list-disc marker:text-grayMed">
					{limitations.map((l) => (
						<li key={l} className="ml-4 pl-1 font-semibold">
							{l}
						</li>
					))}
				</ul>
				<p className="text-grayDark">
					Widen your filters or choose another organisation.
				</p>
			</div>
		</div>
	);
}

function ImpactChartColumnVisualisationError({ error }: { error: Error }) {
	const { message, details } = parseErrorMessage(error, "Organisation impact");
	return (
		<div className="w-full h-96 flex justify-center items-center">
			<ComponentError errorMessage={message} errorDetails={details} />
		</div>
	);
}

function ImpactChartColumnVisualisationImpacts({
	impacts,
	scale,
	itemsCountPerColumn,
	paddingInRem,
	id,
}: {
	impacts: ParsedMediaImpactItemType[] | null;
	negativeAreaHeightInRem: number;
	positiveAreaHeightInRem: number;
	scale: ScaleLinear<number, number, never>;
	itemsCountPerColumn: number;
	paddingInRem: number;
	id: string;
}) {
	return (
		<div
			className="w-full h-96 grid px-4 py-16 gap-4 relative"
			style={{ gridTemplateColumns: `repeat(${itemsCountPerColumn}, 1fr)` }}
		>
			<div
				className="absolute left-0 h-px right-0 bg-grayLight opacity-75"
				style={{ top: `calc(${scale(0) + paddingInRem - 0.5}rem)` }}
			/>
			{impacts
				?.sort((a, b) => a.label.localeCompare(b.label))
				.map(({ label, impact, color, uniqueId }, idx) => {
					const lowerY = scale(impact.lower);
					const upperY = scale(impact.upper);
					const height = lowerY - upperY;
					const Icon = getTopicIcon(label);
					const roundedLower = Number.parseFloat(impact.lower.toFixed(2));
					const roundedUpper = Number.parseFloat(impact.upper.toFixed(2));
					return (
						<div
							className={cn("relative h-full group transition-all")}
							key={`bars-${uniqueId}`}
						>
							<div
								className={cn(
									"absolute left-1/2 -translate-x-1/2 top-0 right-0 text-grayDark",
									"opacity-0 group-hover:opacity-75 transition-all",
									"text-xs translate-y-[calc(-100%-1.25rem)] h-8 leading-tight",
									"flex gap-1 whitespace-nowrap w-fit",
									"pointer-events-none",
								)}
							>
								<Icon size={16} color="currentColor" className="shrink-0" />
								{titleCase(label)}
							</div>
							{roundedLower === 0 && roundedUpper === 0 && (
								<>
									<ImpactChartColumnVisualisationImpactLabel
										top={`calc(${upperY}rem - 1.5rem)`}
										impact={impact.upper}
										prefix="No impact:"
										className={`translate-y-1`}
									/>
									<div
										className="absolute top-0 left-0 h-1 w-full -translate-y-1.5"
										style={{ backgroundColor: color, top: `${upperY}rem` }}
									/>
								</>
							)}
							{(roundedLower !== 0 || roundedUpper !== 0) && (
								<>
									<ImpactChartColumnVisualisationImpactBar
										upperY={upperY}
										color={color}
										height={height}
										label={label}
										impact={impact}
										id={`bar-${id}-${idx}`}
									/>
									<ImpactChartColumnVisualisationImpactLabel
										top={`calc(${upperY}rem - 1.5rem)`}
										impact={impact.upper}
										prefix="Up to"
										className={`translate-y-1`}
									/>
									<ImpactChartColumnVisualisationImpactLabel
										top={`${upperY + height + 1}rem`}
										impact={impact.lower}
										prefix={impact.lower < 0 ? "Down to" : "At least"}
										className={`-translate-y-1`}
									/>
								</>
							)}
						</div>
					);
				})}
		</div>
	);
}

function ImpactChartColumnVisualisationLoading({
	id,
	itemsCountPerColumn,
	totalHeightInRem,
	paddingInRem,
}: {
	id: string;
	itemsCountPerColumn: number;
	totalHeightInRem: number;
	paddingInRem: number;
}) {
	const scale = useMemo(
		() => scaleLinear().domain([0, 1]).range([totalHeightInRem, 0]),
		[totalHeightInRem],
	);
	return (
		<div
			className="w-full h-96 grid px-4 py-16 gap-4 relative"
			style={{ gridTemplateColumns: `repeat(${itemsCountPerColumn}, 1fr)` }}
		>
			<div
				className="absolute left-0 top-1/2 h-px right-0 bg-grayLight opacity-30"
				style={{ top: `calc(${scale(0) + paddingInRem + 0.25}rem)` }}
			/>
			{Array.from({ length: itemsCountPerColumn }).map((_, idx) => {
				const rand1 = seededRandom(`${id}-${idx}-1`);
				const rand2 = seededRandom(`${id}-${idx + Math.PI}-2`);
				const randImpactLower = Math.min(rand1, rand2);
				const randImpactUpper = Math.max(rand1, rand2);
				const lowerY = scale(randImpactLower);
				const upperY = scale(randImpactUpper);
				const height = Math.max(lowerY - upperY, 3);
				return (
					<div
						className={cn("relative h-full transition-all", "animate-pulse")}
						style={{ animationDelay: `${idx * 300}ms` }}
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`loading-${id}-${idx}`}
					>
						{(randImpactLower !== 0 || randImpactUpper !== 0) && (
							<>
								<ImpactChartColumnVisualisationImpactBar
									upperY={upperY}
									color={`var(--grayMed)`}
									height={height}
									label={""}
									impact={{ lower: randImpactLower, upper: randImpactUpper }}
									noLine
									id={`loading-${id}-${idx}`}
								/>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}

function ImpactChartColumnVisualisationImpactBar({
	upperY,
	color,
	height,
	label,
	impact,
	noLine = false,
	id,
}: {
	upperY: number;
	color: string;
	height: number;
	label: string;
	impact: { lower: number; upper: number };
	noLine?: boolean;
	id: string;
}) {
	return (
		<div
			key={id}
			className={cn("w-full h-full absolute left-0 py-1 overflow-clip")}
			style={{
				height: `${height + 0.5}rem`,
				top: `${upperY}rem`,
			}}
		>
			<div
				className={cn(
					"relative w-full min-h-full transition-all grid grid-rows-[1fr]",
					`topic-chart-item topic-chart-item-topic-${slugifyCssClass(label)}`,
				)}
			>
				<ImpactChartColumnVisualisationImpactArrow
					color={color}
					impact={impact}
					height={height}
					noLine={noLine}
				/>
			</div>
		</div>
	);
}

function ImpactChartColumnVisualisationImpactArrow({
	color,
	impact,
	height,
	noLine = false,
}: {
	color: string;
	impact: { lower: number; upper: number };
	height: number;
	noLine?: boolean;
}) {
	const upperRounded = Number.parseFloat(impact.upper.toFixed(2));
	const lowerRounded = Number.parseFloat(impact.lower.toFixed(2));
	const upperUp = upperRounded > 0;
	const lowerUp = lowerRounded > 0;
	const bothUp = upperUp && lowerUp;
	const upAndDown = upperUp && !lowerUp;
	const bothDown = !upperUp && !lowerUp;
	const arrowHeight = Math.min(height / 2, 1);

	let bgPath = "";
	if (bothUp)
		bgPath = `M0 ${arrowHeight} L50 0 L100 ${arrowHeight} L100 ${height} L50 ${height - arrowHeight} L0 ${height}Z`;
	if (bothDown)
		bgPath = `M0 0 L50 ${arrowHeight} L100 0 L100 ${height - arrowHeight} L50 ${height} L0 ${height - arrowHeight}Z`;
	if (upAndDown)
		bgPath = `M0 ${arrowHeight} L50 0 L100 ${arrowHeight} L100 ${height - arrowHeight} L50 ${height} L0 ${height - arrowHeight}Z`;
	if (lowerRounded === 0 && upperUp)
		bgPath = `M0 ${arrowHeight} L50 0 L100 ${arrowHeight} L100 ${height} L0 ${height}Z`;
	if (upperRounded === 0 && !lowerUp)
		bgPath = `M0 0 L100 0 L100 ${height - arrowHeight} L50 ${height} L0 ${height - arrowHeight}Z`;

	let lineUp = `M0 0 L50 ${arrowHeight} L100 0`;
	if (upperUp) lineUp = `M0 ${arrowHeight} L50 0 L100 ${arrowHeight}`;
	if (upperRounded === 0 && !lowerUp) lineUp = `M0 0 L100 0`;

	let lineDown = `M0 ${height - arrowHeight} L50 ${height} L100 ${height - arrowHeight}`;
	if (lowerUp)
		lineDown = `M0 ${height} L50 ${height - arrowHeight} L100 ${height}`;
	if (lowerRounded === 0 && upperUp) lineDown = `M0 ${height} L100 ${height}`;

	return (
		<svg
			className={cn("absolute left-0 top-0 w-full overflow-visible")}
			height={`${height}rem`}
			viewBox={`0 0 100 ${height}`}
			aria-hidden="true"
			preserveAspectRatio="none"
		>
			<defs>
				<mask id="border-top-mask">
					<rect x1={0} y1={0} width={100} height={height} fill="black" />
					<path fill="white" d={bgPath} />
				</mask>
			</defs>
			<path
				fill={color}
				d={bgPath}
				className="[fill-opacity:0.3] group-hover:[fill-opacity:0.5] transition-all"
			/>
			{!noLine && (
				<>
					<path
						stroke={color}
						strokeWidth="3px"
						vectorEffect="non-scaling-stroke"
						d={lineUp}
						fill="none"
					/>
					<path
						stroke={color}
						strokeWidth="3px"
						vectorEffect="non-scaling-stroke"
						d={lineDown}
						fill="none"
					/>
				</>
			)}
		</svg>
	);
}

function ImpactChartColumnVisualisationImpactLabel({
	top,
	impact,
	prefix = "",
	className,
}: {
	top: number | string;
	impact: number;
	prefix?: string;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"absolute text-xs w-full left-0 top-0 text-center text-fg",
				"opacity-0 group-hover:opacity-100 transition ",
				"group-hover:translate-y-0 duration-1000 ease-smooth-out",
				className,
			)}
			style={{ top }}
		>
			{prefix} <strong className="font-semibold">{impact.toFixed(2)}</strong>
		</span>
	);
}

export default ImpactChartColumnVisualisation;
