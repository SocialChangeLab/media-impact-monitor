"use client";
import type { icons } from "lucide-react";
import Icon from "../ui/icon";
import ImpactBarsGroup from "./ImpactBarsGroup";

type ImpactType = {
	label: string;
	impact: number;
	uncertainty: number | null;
	color: string;
	totalBefore: number;
};

type ImpactChartRowProps = {
	impacts: ImpactType[];
	icon: keyof typeof icons;
	unitLabel: string;
};

function ImpactChartRow({ impacts, unitLabel, icon }: ImpactChartRowProps) {
	const impactsWithUncertainty = impacts.filter((i) => i.uncertainty !== null);
	const validImpacts = impactsWithUncertainty.map((i) => i.impact);
	const highestImpact = Math.max(...validImpacts, 0);
	const lowestImpact = Math.min(...validImpacts, 0);
	const total = 1000;
	return (
		<div className="flex flex-col gap-6">
			<ImpactBarsGroup
				impacts={impacts}
				highestImpact={highestImpact}
				lowestImpact={lowestImpact}
				total={total}
			/>
			<div className="flex flex-col gap-6">
				{impactsWithUncertainty.map((i) => {
					const impactShare = `${i.impact > 0 ? "+" : "-"}${Math.round(
						Math.abs((i.impact / i.totalBefore) * 100),
					)}%`;
					const incdeclabel = i.impact > 0 ? "an increase" : "a decrease";
					return (
						<div key={i.label} className="flex flex-col gap-2">
							<p className="font-light">
								causes <strong className="font-bold">{`${incdeclabel}`}</strong>
								{` of `}
								<strong className="font-bold">
									{`${Math.abs(i.impact)} ${unitLabel} (${impactShare})`}
								</strong>{" "}
								about
							</p>
							<div className="grid grid-cols-[auto_1fr] items-center gap-1">
								<Icon name={icon} style={{ color: i.color }} />
								<span className="text-lg font-semibold">{i.label}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ImpactChartRow;
