import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import type { OrganisationType, ParsedEventType } from "@/utility/eventsUtil";
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
					getColorPercentagesByOrganisations(selectedOrganisations, events),
				),
			}}
		/>
	);
}

type ColorsWithPercentages = Record<string, number>;

function getColorPercentagesByOrganisations(
	organisations: OrganisationType[],
	events: ParsedEventType[],
): ColorsWithPercentages {
	if (organisations.length === 0) return {};
	const organisationsColors = organisations
		.sort((a, b) => {
			if (a.isMain && !b.isMain) return -1;
			if (!a.isMain && b.isMain) return 1;
			if (a.color > b.color) return 1;
			if (a.color < b.color) return -1;
			return b.name.localeCompare(a.name);
		})
		.map((x) => x.color);
	const colors2OrgsCount = events.reduce(
		(acc, event) => {
			const org = organisations.find((x) => event.organizers.includes(x.name));
			if (!org) return acc;
			acc[org.color] = (acc[org.color] ?? 0) + (event.size_number ?? 0);
			return acc;
		},
		{} as Record<string, number>,
	);
	const sumSize = Object.values(colors2OrgsCount).reduce(
		(acc, x) => acc + x,
		0,
	);
	const uniqueColors = Array.from(new Set(Object.keys(colors2OrgsCount)));
	return uniqueColors.reduce((acc, color) => {
		acc[color] = (colors2OrgsCount[color] / sumSize) * 100;
		return acc;
	}, {} as ColorsWithPercentages);
}

function getCSSStyleGradientWithEqualSteps(colors: string[]) {
	if (colors.length === 0) return;
	const uniqueColors = Array.from(new Set(colors));
	if (uniqueColors.length === 1) return uniqueColors[0];
	const stepPercentage = Math.round(100 / uniqueColors.length);
	return `linear-gradient(0deg, ${uniqueColors
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
		.map(([color, percentage]) => {
			const newPercentage = `${color} ${lastPercentage}%, ${color} ${lastPercentage + percentage}%`;
			lastPercentage += percentage;
			return newPercentage;
		})
		.join(", ")})`;
}

export default memo(EventBubbleLink);
