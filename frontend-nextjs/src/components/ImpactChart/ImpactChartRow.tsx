"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { slugifyCssClass } from "@/utility/cssSlugify";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";
import { topicIsSentiment } from "@/utility/topicsUtil";
import {
	ArrowDown,
	ArrowUp,
	ChevronsUpDownIcon,
	type icons,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import ComponentError from "../ComponentError";
import { OrganisationsSelect } from "../OrganisationsSelect";
import {
	ImpactKeywordLabel,
	ImpactKeywordLabelTooltip,
} from "./ImpactKeywordLabel";

type ImpactChartRowProps = {
	impacts: ParsedMediaImpactItemType[] | null;
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
	limitations,
	error,
	defaultOrganizer,
	onOrgChange = () => {},
}: ImpactChartRowProps) {
	const impactsWithUncertainty = (impacts ?? []).sort((a, b) =>
		a.label.localeCompare(b.label),
	);
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
		<div className="flex flex-col gap-6 pr-6">
			<div className="flex flex-col gap-2">
				{impactsWithUncertainty.length > 0 && <p>An average protest by:</p>}
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
				{impactsWithUncertainty.map((i) => (
					<ImpactChartRowSentence key={i.label} unitLabel={unitLabel} {...i} />
				))}
			</div>
		</div>
	);
}

function formatValue(value: number) {
	return Number.parseFloat(Math.abs(value).toFixed(2)).toLocaleString("en-GB");
}

function ImpactChartRowSentence(
	i: ParsedMediaImpactItemType & {
		unitLabel: string;
	},
) {
	const incdeclabel = i.impact.lower > 0 ? "increases" : "decreases";
	const unclearTendency = i.impact.upper > 0 && i.impact.lower < 0;
	const isSentiment = topicIsSentiment(i.label);
	const formattedLowerBound = formatValue(i.impact.lower);
	const formattedUpperBound = formatValue(i.impact.upper);
	const leastBound =
		incdeclabel === "increases" ? formattedLowerBound : formattedUpperBound;
	const mostBound =
		incdeclabel === "increases" ? formattedUpperBound : formattedLowerBound;
	const ChangeIcon = useMemo(() => {
		if (unclearTendency) return ChevronsUpDownIcon;
		return i.impact.mean > 0 ? ArrowUp : ArrowDown;
	}, [unclearTendency, i.impact.mean]);

	const topicNodeWithoutTooltip = useMemo(
		() => <ImpactKeywordLabel {...i} />,
		[i],
	);

	const topicNode = useMemo(
		() => (
			<ImpactKeywordLabelTooltip unitLabel={i.unitLabel} keywords={undefined}>
				{/* TODO: Add real keywords */}
				{topicNodeWithoutTooltip}
			</ImpactKeywordLabelTooltip>
		),
		[i.unitLabel, topicNodeWithoutTooltip],
	);

	return (
		<p
			className={cn(
				"mt-2 pl-5 relative text-grayDark text-balance",
				`legend-topic legend-topic-${slugifyCssClass(i.label)}`,
			)}
		>
			<ChangeIcon
				className={cn(
					"absolute left-0 top-0 text-grayDark size-4 translate-y-0.5",
					unclearTendency && "opacity-50",
				)}
			/>
			{unclearTendency && (
				<>
					{`leads to `}
					<B>no clear evidence</B>
					{` of an increase or decrease in `}
					{isSentiment && <> {topicNode} </>}
					{` ${i.unitLabel} produced `}
					{!isSentiment && <>about {topicNode}</>}
				</>
			)}
			{!unclearTendency && (
				<>
					<B>{incdeclabel}</B>
					{isSentiment && <> {topicNode} </>}
					{` ${i.unitLabel} produced `}
					{!isSentiment && <>about {topicNode}</>}
					{" by at least "}
					<B>{leastBound}</B>
					{` and up to `}
					<B>{mostBound}</B>
				</>
			)}
		</p>
	);
}

function B(props: { children: ReactNode }) {
	return <strong className="font-semibold text-fg">{props.children}</strong>;
}

export default ImpactChartRow;
