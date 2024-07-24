"use client";
import type { icons } from "lucide-react";
import { OrganisationsSelect } from "../OrganisationsSelect";
import Icon from "../ui/icon";
import { isTooUncertain } from "./ImpactBar";

type ImpactType = {
	label: string;
	impact: number;
	uncertainty: number | null;
	color: string;
	limitations?: string[];
};

type ImpactChartRowProps = {
	impacts: ImpactType[] | null;
	icon: keyof typeof icons;
	unitLabel: string;
	limitations?: string[];
};

function ImpactChartRow({
	impacts,
	unitLabel,
	icon,
	limitations,
}: ImpactChartRowProps) {
	const impactsWithUncertainty =
		impacts?.filter((i) => !isTooUncertain(i.uncertainty)) ?? [];
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4">
				<OrganisationsSelect />

				{limitations && limitations.length > 0 && (
					<div className="flex flex-col gap-2">
						{limitations.map((l) => (
							<p key={l}>{l}</p>
						))}
					</div>
				)}
				{impactsWithUncertainty.map((i) => {
					const impactShare = `${i.impact > 0 ? "+" : "-"}${Math.round(
						Math.abs((i.impact / 1) * 100),
					)}%`;
					const incdeclabel = i.impact > 0 ? "an increase" : "a decrease";
					return (
						<div key={i.label} className="flex flex-col gap-2">
							<p className="font-light">
								causes <strong className="font-bold">{`${incdeclabel}`}</strong>
								{" of "}
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
