import { cn } from "@/utility/classNames";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import Link from "next/link";
import { memo } from "react";

type EventBubbleLinkProps = {
	event: EventType;
	organisations: OrganisationType[];
};

const bubbleClasses = cn(
	"absolute inset-0 rounded-full bg-grayMed",
	"ring-0 ring-fg transition-all hover:ring-2",
	"ring-offset-0 ring-offset-bg hover:ring-offset-2",
	"focus-visible:ring-offset-2 focus-visible:ring-2",
	"cursor-pointer active:cursor-pointer",
);

function EventBubbleLink({ event, organisations }: EventBubbleLinkProps) {
	return (
		<Link
			href={`/events/${event.event_id}`}
			className={bubbleClasses}
			style={{
				background: getCSSStyleGradient(organisations.map((x) => x.color)),
			}}
		/>
	);
}

export function AggregatedEventsBubble({
	organisations,
}: {
	organisations: OrganisationType[];
}) {
	return (
		<span
			className={cn(bubbleClasses, "rounded-sm")}
			style={{
				background: getCSSStyleGradient(organisations.map((x) => x.color)),
			}}
		/>
	);
}

function getCSSStyleGradient(colors: string[]) {
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

export default memo(EventBubbleLink);
