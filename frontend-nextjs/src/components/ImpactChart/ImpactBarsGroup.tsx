import { cn } from "@/utility/classNames";
import type { icons } from "lucide-react";
import { Fragment, memo } from "react";
import slugify from "slugify";
import ImpactBar from "./ImpactBar";

type ImpactBarsGroupProps = {
	total: number;
	unitLabel: string;
	icon: keyof typeof icons;
	highestImpact: number;
	lowestImpact: number;
	impacts: Array<{
		impact: number;
		uncertainty: number | null;
		label: string;
		color: string;
	}>;
};

function ImpactBarsGroup({
	total,
	unitLabel,
	icon,
	lowestImpact,
	highestImpact,
	impacts,
}: ImpactBarsGroupProps) {
	const height = 300;
	const impactRange = highestImpact + Math.abs(lowestImpact);
	const negativeImpactShare = Math.abs(lowestImpact) / impactRange;
	const positiveImpactShare = Math.abs(highestImpact) / impactRange;
	const negativeImpactHeight = Math.floor(height * negativeImpactShare);
	const positiveImpactHeight = Math.floor(height * positiveImpactShare);
	const verticalPadding = 32;
	return (
		<div
			className={cn("grid grid-cols-1 group")}
			style={{
				height: height + verticalPadding * 2,
				paddingTop: verticalPadding,
				paddingBottom: verticalPadding,
				gridTemplateRows: `1fr ${negativeImpactHeight}px`,
			}}
		>
			<div
				className="grid gap-4 border-b border-grayLight"
				style={{
					gridTemplateColumns: `repeat(${impacts.length}, 1fr)`,
				}}
			>
				{impacts.map(({ impact, uncertainty, label, color }) => {
					const impactAsPercentageOfTotal = Math.abs(impact) / total;
					const impactShare = positiveImpactShare / impactAsPercentageOfTotal;
					return (
						<Fragment key={label}>
							{impact > 0 ? (
								<ImpactBar
									impact={impactShare}
									impactLabel={Math.round(impact).toLocaleString("en-GB")}
									uncertainty={uncertainty}
									color={color}
									uniqueId={slugify(label)}
									totalHeight={positiveImpactHeight}
									padding={verticalPadding}
								/>
							) : (
								<span />
							)}
						</Fragment>
					);
				})}
			</div>
			{lowestImpact < 0 && (
				<div
					className="grid gap-4"
					style={{
						gridTemplateColumns: `repeat(${impacts.length}, 1fr)`,
					}}
				>
					{impacts.map(({ impact, uncertainty, label, color }) => {
						const impactAsPercentageOfTotal = Math.abs(impact) / total;
						const impactShare = negativeImpactShare / impactAsPercentageOfTotal;
						return (
							<Fragment key={label}>
								{impact < 0 ? (
									<ImpactBar
										impact={-impactShare}
										impactLabel={Math.round(impact).toLocaleString("en-GB")}
										uncertainty={uncertainty}
										color={color}
										uniqueId={slugify(label)}
										totalHeight={negativeImpactHeight}
										padding={verticalPadding}
									/>
								) : (
									<span />
								)}
							</Fragment>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default memo(ImpactBarsGroup);
