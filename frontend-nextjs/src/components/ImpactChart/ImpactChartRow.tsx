"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import { titleCase } from "@/utility/textUtil";
import type { icons } from "lucide-react";
import { useEffect, useState } from "react";
import ComponentError from "../ComponentError";
import { OrganisationsSelect } from "../OrganisationsSelect";
import RoundedColorPill from "../RoundedColorPill";
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
	icon?: keyof typeof icons;
	unitLabel: string;
	limitations?: string[];
	error?: Error | null;
	defaultOrganizer?: EventOrganizerSlugType;
	onOrgChange?: (organiser: EventOrganizerSlugType) => void;
};

function ImpactChartRow({
	impacts,
	unitLabel,
	icon,
	limitations,
	error,
	defaultOrganizer,
	onOrgChange = () => {},
}: ImpactChartRowProps) {
	const impactsWithUncertainty =
		impacts?.filter((i) => !isTooUncertain(i.uncertainty)) ?? [];
	const [organizer, setOrganizer] = useState<
		EventOrganizerSlugType | undefined
	>(defaultOrganizer);
	const selectedOrganizers = useFiltersStore((state) =>
		state.organizers.sort(),
	);

	useEffect(() => {
		if (!defaultOrganizer) return;
		setOrganizer(defaultOrganizer);
	}, [defaultOrganizer]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4">
				<OrganisationsSelect
					multiple={false}
					organisations={
						selectedOrganizers.length === 0 ? undefined : selectedOrganizers
					}
					selectedOrganisations={organizer ? [organizer] : []}
					onChange={(orgs) => {
						setOrganizer(orgs[0]);
						onOrgChange(orgs[0]);
					}}
				/>

				{limitations && limitations.length > 0 && (
					<div className="flex flex-col gap-2">
						{limitations.map((l) => (
							<p key={l}>{l}</p>
						))}
					</div>
				)}
				{error && (
					<ComponentError
						errorMessage={
							parseErrorMessage(error, `Organisation impact`).message
						}
						errorDetails={
							parseErrorMessage(error, `Organisation impact`).details
						}
					/>
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
							<div
								className={cn(
									"grid grid-cols-[auto_1fr] items-center",
									icon ? "gap-1" : "gap-2",
								)}
							>
								{icon ? (
									<Icon name={icon} style={{ color: i.color }} />
								) : (
									<RoundedColorPill color={i.color} />
								)}
								<span className="text-lg font-semibold">
									{titleCase(i.label)}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ImpactChartRow;
