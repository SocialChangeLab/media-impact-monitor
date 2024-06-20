"use client";
import type { icons } from "lucide-react";
import Icon from "../ui/icon";

type ImpactType = {
	label: string;
	impact: number;
	uncertainty: number | null;
	color: string;
};

type ImpactChartRowProps = {
	impacts: ImpactType[];
	icon: keyof typeof icons;
	unitLabel: string;
};

function ImpactChartRow({ impacts, unitLabel, icon }: ImpactChartRowProps) {
	const impactsWithUncertainty = impacts.filter((i) => i.uncertainty !== null);
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6">
				{impactsWithUncertainty.map((i) => {
					const impactShare = `${i.impact > 0 ? "+" : "-"}${Math.round(
						Math.abs((i.impact / 1) * 100),
					)}%`;
					const incdeclabel = i.impact > 0 ? "an increase" : "a decrease";
					return (
						<div key={i.label} className="flex flex-col gap-2">
							<p className="font-light">
								causes <strong className="font-bold">{`${incdeclabel}`}</strong>
								{` of `}
								<strong className="font-bold">
									{`${Math.round(Math.abs(i.impact)).toLocaleString(
										"en-GB",
									)} ${unitLabel} (${impactShare})`}
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
