import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import {
	type OrganisationType,
	type ParsedEventType,
	compareOrganizationsByColors,
} from "@/utility/eventsUtil";
import { getDateRangeByAggregationUnit } from "@/utility/useTimeIntervals";
import Link from "next/link";
import { memo } from "react";
import { TooltipTrigger } from "../ui/tooltip";
import type { AggregatedItemType } from "./EventsTimelineAggregatedItem";

type EventBubbleLinkProps = {
	event: ParsedEventType;
	organisations: OrganisationType[];
};

const bubbleClasses = cn(
	"absolute inset-0 rounded-full bg-grayMed",
	"ring-0 ring-fg transition-all hover:ring-2",
	"ring-offset-0 ring-offset-bg hover:ring-offset-2",
	"focus-visible:ring-offset-2 focus-visible:ring-2",
	"cursor-pointer active:cursor-pointer focusable",
);

function EventBubbleLink({
	event,
	organisations,
	...otherProps
}: EventBubbleLinkProps) {
	return (
		<TooltipTrigger asChild>
			<Link
				href={`/events/${event.event_id}`}
				className={bubbleClasses}
				style={{
					background: getCSSStyleGradientWithEqualSteps(
						organisations.map((x) => x.color),
					),
				}}
				{...otherProps}
			>
				<span className="sr-only">
					{`Protest by ${event.organizers.slice(0, 3).join(", ")}${
						event.organizers.length > 3
							? `and ${event.organizers.length - 3} more`
							: ""
					}: "${event.description.slice(0, 300)}${
						event.description.length > 300 ? "..." : ""
					}"`}
				</span>
			</Link>
		</TooltipTrigger>
	);
}

export function AggregatedEventsBubble({
	selectedOrganisations,
	date,
	aggregationUnit,
	events,
	sumSize,
}: AggregatedItemType) {
	const { setDateRange } = useFiltersStore(({ setDateRange }) => ({
		setDateRange,
	}));

	return (
		<button
			type="button"
			onClick={() =>
				setDateRange(getDateRangeByAggregationUnit({ aggregationUnit, date }))
			}
			className={cn(bubbleClasses, "rounded-sm")}
			style={{
				background: getCSSStyleGradientWithPercentages(
					getColorPercentagesByParticipants(selectedOrganisations, events),
				),
			}}
		/>
	);
}

type ColorsWithPercentages = Record<string, number>;

function getColorPercentagesByParticipants(
	organisations: OrganisationType[],
	events: ParsedEventType[],
): ColorsWithPercentages {
	if (organisations.length === 0) return {};
	const organisationsColors = organisations
		.sort(compareOrganizationsByColors)
		.map((x) => x.color);
	const uniqueColors = Array.from(new Set(organisationsColors));
	const colors2OrgsCount = events.reduce(
		(acc, event) => {
			const eventSum = event.size_number ?? 0 / event.organizers.length;
			for (const organizer of event.organizers) {
				const org = organisations.find((x) => x.slug === organizer.slug);
				if (!org) continue;
				const currentColorCount = acc[org.color] ?? 0;
				acc[org.color] = currentColorCount + eventSum;
			}
			return acc;
		},
		{} as Record<string, number>,
	);
	const sumSize = Object.values(colors2OrgsCount).reduce(
		(acc, count) => acc + count,
		0,
	);
	return uniqueColors.reduce((acc, color) => {
		const count = colors2OrgsCount[color] ?? 0;
		const sum = sumSize ?? 0;
		acc[color] = (count / sum) * 100;
		return acc;
	}, {} as ColorsWithPercentages);
}

function getCSSStyleGradientWithEqualSteps(colors: string[]) {
	if (colors.length === 0) return;
	if (colors.length === 1) return colors[0];
	const stepPercentage = Math.round(100 / colors.length);
	return `linear-gradient(0deg, ${colors
		.map(
			(color, i) =>
				`${color} ${i * stepPercentage}%, ${color} ${
					(i + 1) * stepPercentage
				}%`,
		)
		.join(", ")})`;
}

function getCSSStyleGradientWithPercentages(
	colorsWithPercentages: ColorsWithPercentages,
) {
	let lastPercentage = 0;
	return `linear-gradient(0deg, ${Object.entries(colorsWithPercentages)
		.sort((a, b) => b[1] - a[1])
		.map(([color, percentage]) => {
			const newPercentage = `${color} ${lastPercentage}%, ${color} ${lastPercentage + percentage}%`;
			lastPercentage += percentage;
			return newPercentage;
		})
		.join(", ")})`;
}

export default memo(EventBubbleLink);
